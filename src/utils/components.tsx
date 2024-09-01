import {FC, useEffect, useRef} from "react";

export const HtmlRenderer: FC<{ content: string | undefined }> = ({content}) => {
    const containerRef = useRef(null);
    useEffect(() => {
        // @ts-ignore
        window?.MathJax && window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, containerRef.current]);
    }, [content]);

    if(!content) return
    return (
        <div  ref={containerRef} dangerouslySetInnerHTML={{__html: content}}/>
    );
};