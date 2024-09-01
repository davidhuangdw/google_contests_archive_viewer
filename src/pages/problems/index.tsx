import {find, isEmpty, map, upperFirst} from "lodash";
import {FC, ReactNode, useContext} from "react";
import {SimpleTreeView, TreeItem} from "@mui/x-tree-view";
import ProblemContext, {TreeNode} from "../../contexts/ProblemContext.tsx";
import {get_path_last} from "../../utils";
import {Box, Button, Container} from "@mui/material";
import {HtmlRenderer} from "../../utils/components.tsx";

const ProblemsTree: FC = () => {
    const {round_tree, round_problems, set_cur_item} = useContext(ProblemContext)
    const renderTree = (node: TreeNode): ReactNode => {
        return <>
            {map(node, (sub, id) => {
                return <TreeItem key={id} itemId={id} label={get_path_last(id)}>
                    {
                        isEmpty(sub) ?
                            map([id + "/overview", ...round_problems[id]], p => <TreeItem key={p} itemId={p}
                                                                                          label={get_path_last(p)}/>) :
                            renderTree(sub)}
                </TreeItem>
            })}
        </>
    };


    return (
        <Box sx={{margin: 2, minWidth: 250}}>
            <SimpleTreeView onSelectedItemsChange={(_e, id) => id && set_cur_item(id)}>
                {renderTree(round_tree)}
            </SimpleTreeView>
        </Box>
    );
};

// const DownloadProblemDataButton: FC<{ fname: string, fpath: string }> = ({fname, fpath}) => {
//     return <Button onClick={() => downloadProblemData(fname, fpath)}>{fname}</Button>
// }

const Problems: FC = () => {
    const {problem, round_info, show_analysis, set_show_analysis} = useContext(ProblemContext);
    const problem_name = get_path_last(problem);
    const problem_title = problem_name.split("_").map(upperFirst).join(" ");

    let problem_statement = round_info?.overview;
    let analysis;
    let isOverview = problem_name === "overview";
    if (!isOverview) {
        let pinfo = find(round_info?.problems, p => p?.name == problem)
        problem_statement = pinfo?.problem;
        analysis = pinfo?.analysis;
    }

    return <div style={{display: "flex"}}>
        <ProblemsTree/>
        {problem && <Container sx={{flexGrow: 1, marginBottom: 10}}>
            <h1>{problem_title}</h1>
            {problem}
            <HtmlRenderer content={problem_statement}/>

            {!isOverview && <div>
                {/*<div>*/}
                {/*    <DownloadProblemDataButton fname={`${problem_name}_small.in`}*/}
                {/*                               fpath={`${problem}/data/secret/subtask1/1.in`}/>*/}
                {/*    <DownloadProblemDataButton fname={`${problem_name}_small.out`}*/}
                {/*                               fpath={`${problem}/data/secret/subtask1/1.ans`}/>*/}
                {/*</div>*/}
                {/*<div>*/}
                {/*    <DownloadProblemDataButton fname={`${problem_name}_large.in`}*/}
                {/*                               fpath={`${problem}/data/secret/subtask2/1.in`}/>*/}
                {/*    <DownloadProblemDataButton fname={`${problem_name}_large.out`}*/}
                {/*                               fpath={`${problem}/data/secret/subtask2/1.ans`}/>*/}
                {/*</div>*/}
                <Button size="large" onClick={()=> set_show_analysis(!show_analysis)}>{show_analysis ? "Hide Analysis" : "Show Analysis"}</Button>
                {show_analysis && <div>
                    <h2>Analysis</h2>
                    <HtmlRenderer content={analysis}/>
                </div>}
            </div>}
        </Container>}
    </div>
}

export default Problems;