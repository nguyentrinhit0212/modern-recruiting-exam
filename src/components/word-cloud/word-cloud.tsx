import {FormEvent, useEffect, useState} from "react";
import {Trie} from "@/algorithms/trie";
type WordCloudProps = {
    data: string
}

type Word = {
    word: string,
    count: number,
    width: number,
    height: number
}
export default function WordCloud () {
    const [words, setWords] = useState<Word[]>([])
    const [inputText, setInputText] = useState('')
    useEffect(() => {
        function computeSize(input: [string, number]): Word {
            const wRatio = 8
            const hRatio = 4

            return {
                word: input[0],
                count: input[1],
                width: input[1] * wRatio,
                height: input[1] * hRatio
            }
        }

        const trie = new Trie()
        if (inputText && inputText.length > 0) {
            const sanitizedText = inputText.replace(/[^a-zA-Z\s]/g, '')
            sanitizedText.toLowerCase().split(/\s+/).forEach(word => {
                if (word) trie.insert(word)
            })
        }
        setWords(trie.getWordsWithCount().map(word => computeSize(word)))
    }, [inputText]);

    function handleInput(e: FormEvent<HTMLTextAreaElement>) {
        e.preventDefault()
        if (e?.currentTarget?.value) setInputText(e.currentTarget.value)
    }
    return <div className={"container h-auto mt-20 flex justify-between text-black"}>
        <div className={"w-1/2"}>
            <textarea className="w-11/12 h-96 border rounded-md" onInput={(e) => {handleInput(e)}} placeholder="Nhập từ..." />
        </div>
        <div className={"w-1/2"}>
            <table className={"w-11/12 table-auto"}>
                <thead>
                    <tr>
                        <th className={"border px-4 py-2"}>Word</th>
                        <th className={"border px-4 py-2"}>Count</th>
                        <th className={"border px-4 py-2"}>Width</th>
                        <th className={"border px-4 py-2"}>Height</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        words.map((word, index) => {
                            return <tr key={`row-${index}`}>
                                <td className={"border px-4 py-2"}>{word.word}</td>
                                <td className={"border px-4 py-2"}>{word.count}</td>
                                <td className={"border px-4 py-2"}>{word.width}</td>
                                <td className={"border px-4 py-2"}>{word.height}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
        </div>
    </div>
}