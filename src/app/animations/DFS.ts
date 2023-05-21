import { Color } from "three";
import type { Tree } from "@/app/structures/Tree";
import type { Node } from "@/app/structures/Node";

export class DFS {
	private tree: Tree;
	private valueToFind: number;
	private steps: (() => Promise<void>)[] = [];

	constructor(tree: Tree, valueToFind: number) {
		this.tree = tree;
		this.valueToFind = valueToFind;
	}

	createDFSSteps(node: Node | null) {
		if (!node) {
			return;
		}

		this.steps.push(() => this.blinkNode(node, new Color(0x008000))); // green

		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];

			this.steps.push(() => this.blinkNode(child, new Color(0x0000FF))); // blue

			this.createDFSSteps(child);

			if (child.data !== this.valueToFind) {
				this.steps.push(() => this.blinkNode(child, new Color(0xFF0000))); // red
			}
		}
	}

	async start() {
		this.createDFSSteps(this.tree.root);
		for (const step of this.steps) {
			await step();
		}
	}

	private blinkNode(node: Node, color: Color) {
		if (node.circle) {
			return node.circle.blink(color, 3);
		}

		return Promise.resolve();
	}
}
