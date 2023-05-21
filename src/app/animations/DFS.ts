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
			} else {
				this.steps.push(async () => {
					console.log("NODE FOUND!!!");
					this.shiftNodeColor(child, new Color(0xFFD700));
				});
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
			return node.circle.blink(color, 1, node.data);
		}

		return Promise.resolve();
	}

	private shiftNodeColor(node: Node, color: Color) {
		if (node.circle) {
			return node.circle.smoothBorderColorShift(color);
		}

		return Promise.resolve();
	}
}
