import {FC} from "react";

export const HtmlRenderer: FC<{ content: string | undefined }> = ({content}) => {
    // const containerRef = useRef(null);
    // useEffect(() => {
    //     window?.MathJax && window.MathJax.Hub.Queue(['Typeset', window.MathJax.Hub, containerRef.current]);
    // }, [content]);

    if(!content) return
    return (
        <div dangerouslySetInnerHTML={{__html: content}}/>
    );
};