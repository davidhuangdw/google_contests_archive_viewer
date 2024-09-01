// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod files;
mod config;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_problem_paths() -> Vec<String> {
    files::get_problem_paths()
}
#[tauri::command]
fn get_round_info(round: &str) -> String {
    files::get_round_info(round)
}

#[tauri::command]
fn read_local_file(file_path: &str) -> Vec<u8> {
    files::read_local_file(file_path).unwrap()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_problem_paths, get_round_info, read_local_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
