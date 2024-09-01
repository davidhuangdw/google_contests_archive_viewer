import {each} from "lodash";
import {createContext, FC, PropsWithChildren, useEffect, useMemo, useState} from "react";
import {invoke} from "@tauri-apps/api";
import {get_path_last, get_path_parent} from "../utils";

export type TreeNode = {
    [key: string]: TreeNode;
};

type RoundProblems = { [round_id: string]: string[] };
type ProblemRound = { [problem_id: string]: string };
type RoundInfo = {
    name: string;
    overview: string;
    problems: {name: string, problem: string, analysis: string}[];
}

type ProblemContextType = {
    problem_paths: string[];
    round_tree: TreeNode;
    round_problems: RoundProblems;
    problem_round: ProblemRound;
    cur_item: string;
    set_cur_item: (cur_item: string) => void;
    problem: string;
    round: string;
    round_info: RoundInfo | undefined;
    show_analysis: boolean;
    set_show_analysis: (show_analysis: boolean) => void;
}

export const ProblemContext = createContext<ProblemContextType>({
    problem_paths: [],
    round_tree: {},
    round_problems: {},
    problem_round: {},
    cur_item: '',
    set_cur_item: () => void 0,
    problem: '',
    round: '',
    round_info: undefined,
    show_analysis: false,
    set_show_analysis: () => void 0,
});

function parse_problem_paths(paths: string[]): [TreeNode, RoundProblems, ProblemRound] {
    const round_tree: TreeNode = {};
    const round_problems: RoundProblems = {};
    const problem_round: ProblemRound = {};
    for (const path of paths) {
        let problem = path;
        let ends: number[] = [];
        each(path, (ch, i) => {if(ch === '/') ends.push(i)});
        let subs = ends.map(i => path.substring(0, i))
        let round = subs[subs.length-1];

        let nd = round_tree;
        each(subs, sub => {
            nd[sub] ||= {};
            nd = nd[sub]!
        })

        round_problems[round] ||= [];
        round_problems[round].push(problem);
        problem_round[problem] = round;
    }
    return [round_tree, round_problems, problem_round];
}

export const ProblemContextProvider: FC<PropsWithChildren> = ({children}) => {
    const [show_analysis, set_show_analysis] = useState(false);
    const [problem_paths, set_problem_paths] = useState<string[]>([]);
    const [cur_item, set_cur_item] = useState("");
    const [problem, set_problem] = useState("");
    const [round_info, set_round_info] = useState<RoundInfo>();
    useEffect(() => {
        const run = async () => {
            set_problem_paths(await invoke("get_problem_paths") as string[])
        }
        run();
    }, []);
    const [round_tree, round_problems, problem_round] = useMemo(() => {
        return parse_problem_paths(problem_paths);
    }, [problem_paths]);

    useEffect(()=>{
        const problem = get_path_last(cur_item) == 'overview' || problem_round[cur_item] ? cur_item : '';
        if(problem) {
            set_problem(problem)
            set_show_analysis(false)
        }
    }, [round_problems, problem_round, cur_item])

    const round = useMemo(()=>{
        return get_path_parent(problem);
    }, [problem])

    useEffect(() => {
        const run = async () => {
            if(!round) return
            let resp: string = await invoke("get_round_info", {round})
            console.log('--------resp', resp)
            console.log(JSON.parse(resp))
            if(resp){
                set_round_info(JSON.parse(resp))
            }
        }
        run();
    }, [round]);

    useEffect(() => {
        console.log('---------tree:', round_tree, round_problems)
    }, [round_tree, round_problems]);

    useEffect(() => {
        console.log('------------problem:', problem, round)
    }, [problem]);


    return <ProblemContext.Provider
        value={{problem_paths, round_tree, round_problems, problem_round, cur_item, set_cur_item, problem, round, round_info, show_analysis, set_show_analysis}}
        children={children}/>
}

export default ProblemContext;
