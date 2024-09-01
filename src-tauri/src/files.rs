use std::string::String;
use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use glob::glob;
use serde::Serialize;
use crate::config;

static ARCHIVE_DIR: &str = config::GOOGLE_ARCHIVE_DIR;

#[derive(Serialize)]
struct ProblemInfo {
    name: String,
    problem: String,
    analysis: String,
}
#[derive(Serialize)]
struct RoundInfo {
    overview: String,
    problems: Vec<ProblemInfo>,
}

fn glob_paths(pattern: String) -> Vec<PathBuf> {
    let mut subs: Vec<PathBuf> = Vec::new();
    for ent in glob(&pattern).unwrap() {
        let e = ent.unwrap();
        subs.push(e);
    }
    subs
}

fn get_path_last(pb: PathBuf) -> Option<String> {
    if let Some(p) = pb.as_path().to_str() {
        let parts: Vec<&str> = p.split('/').collect();
        if let Some(last_part) = parts.last().copied() {
            return Some(String::from(last_part));
        }
    }
    None
}

fn sub_dirs(parent: &str) -> Vec<String> {
    let mut subs: Vec<String> = Vec::new();
    for e in glob_paths(format!("{parent}/*")) {
        if e.metadata().unwrap().is_dir() {
            if let Some(p) = get_path_last(e) {
                subs.push(p);
            }
        }
    }
    subs
}

// fn sub_files(parent: &str) -> Vec<String> {
//     let mut subs: Vec<String> = Vec::new();
//     for e in glob_paths(format!("{parent}/*")) {
//         if e.metadata().unwrap().is_file() {
//             if let Some(p) = get_path_last(e) {
//                 subs.push(p);
//             }
//         }
//     }
//     subs
// }

fn read_file(path: String) -> String {
    fs::read_to_string(path.clone())
        .unwrap_or_else(|_| format!("read failed: {path}"))
}

pub(crate) fn get_problem_paths() -> Vec<String> {
    let fr = ARCHIVE_DIR.len() + 1;
    let ed = "/problem_statement".len();

    config::SUB_FOLDERS.iter().flat_map(|sub| {
        let ps: Vec<String> = glob_paths(format!("{ARCHIVE_DIR}/{sub}/**/problem_statement")).iter()
            .filter_map(|p| p.as_path().to_str())
            .map(|p| String::from(&p[fr..p.len() - ed]))
            .collect();
        ps
    }).collect()
}
pub(crate) fn get_round_info(round: &str) -> String {
    let round_path = format!("{ARCHIVE_DIR}/{round}");
    let overview: String = read_file(format!("{round_path}/round_overview.html"));
    let mut problems: Vec<ProblemInfo> = Vec::new();
    sub_dirs(&round_path).iter().for_each(|p| {
        let name = format!("{round}/{p}");
        let problem_path = format!("{ARCHIVE_DIR}/{name}");
        let problem: String = read_file(format!("{problem_path}/problem_statement/problem.html"));
        let analysis: String = read_file(format!("{problem_path}/problem_statement/analysis.html"));
        problems.push(ProblemInfo {
            name,
            problem,
            analysis,
        })
    });
    let info = RoundInfo {
        overview,
        problems,
    };
    serde_json::to_string(&info).unwrap()
}
pub(crate) fn read_local_file(file_path: &str) -> std::io::Result<Vec<u8>> {
    let mut file = File::open(format!("{ARCHIVE_DIR}/{file_path}"))?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;
    Ok(buffer)
}
