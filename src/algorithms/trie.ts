class TrieNode {
    children: { [key: string]: TrieNode };
    isEndOfWord: boolean;
    count: number;

    constructor() {
        this.children = {};
        this.isEndOfWord = false;
        this.count = 0;
    }
}

export class Trie {
    root: TrieNode;

    constructor() {
        this.root = new TrieNode();
    }

    insert(word: string): void {
        let node = this.root;
        for (const char of word) {
            if (!node.children[char]) {
                node.children[char] = new TrieNode();
            }
            node = node.children[char];
        }
        node.isEndOfWord = true;
        node.count++;
    }

    private collectWords(node: TrieNode, prefix: string, results: [string, number][]): void {
        if (node.isEndOfWord) {
            results.push([prefix, node.count]);
        }
        for (const char in node.children) {
            this.collectWords(node.children[char], prefix + char, results);
        }
    }

    getWordsWithCount(): [string, number][] {
        const results: [string, number][] = [];
        this.collectWords(this.root, '', results);
        return results;
    }
}
