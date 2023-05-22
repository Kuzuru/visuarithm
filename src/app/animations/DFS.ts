import { Color } from "three";
import type { Tree } from "@/app/structures/Tree";
import type { Node } from "@/app/structures/Node";
import { NodeAnimations } from "@/app/animatiors/common/NodeAnimations";

export class DFS {
	private tree: Tree;
	private valueToFind: number;
	private steps: (() => Promise<void>)[] = [];
	private stopExecution: boolean;

	constructor(tree: Tree, valueToFind: number) {
		this.tree = tree;
		this.stopExecution = false;
		this.valueToFind = valueToFind;
	}

	createDFSSteps(node: Node | null) {
		if (!node) {
			return;
		}

		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];

			this.steps.push(() => NodeAnimations.blinkNode(child, new Color(0x0000FF))); // blue

			this.createDFSSteps(child);

			if (child.data !== this.valueToFind) {
				this.steps.push(() => NodeAnimations.shiftNodeColor(child, new Color(0xFF0000)));
			} else {
				this.steps.push(async () => {
					console.log("NODE FOUND!!!");

					NodeAnimations.shiftNodeColor(child, new Color(0xFFD700));
					NodeAnimations.changeNodeRadius(child, 0.15, 1000);

					// Закрашиваем весь путь обратно зеленым
					let parent = child.parent;
					while (parent) {
						await NodeAnimations.shiftNodeColor(parent, new Color(0x008000)); // green
						parent.setNonColorable();
						parent = parent.parent;
					}

					NodeAnimations.changeNodeRadius(child, 0.1, 1000);

					this.stopExecution = true;
				});
			}
		}
	}

	async start() {
		this.createDFSSteps(this.tree.root);
		for (const step of this.steps) {
			// If got stopExecution flag, stop execution
			if (this.stopExecution) {
				break;
			}

			await step();
		}
	}
}
