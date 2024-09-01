import {findLastIndex} from "lodash";
import {invoke} from "@tauri-apps/api";

export const get_path_last = (path: string): string => {
    const parts = path.split('/');
    return parts.length ? parts[parts.length - 1] : '';
};

export const get_path_parent = (path: string): string => {
    return path && path.slice(0, findLastIndex(path, ch => ch==='/') || 0);
};

export const downloadFile = (fileData: Iterable<number>, fileName: string) => {
    try {
        // Convert the file data (Uint8Array) to a Blob
        const blob = new Blob([new Uint8Array(fileData)], { type: 'application/octet-stream' });

        // Create a download link
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Use the file name from the path
        document.body.appendChild(a);
        a.click();

        // Clean up
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log('File downloaded successfully');
    } catch (error) {
        console.error('Failed to download file:', error);
    }
}


export const downloadProblemData = async (fname: string, filePath: string)=>{
    let fileData = await invoke("read_local_file", {filePath}) as Iterable<number>;
    downloadFile(fileData, fname)
}