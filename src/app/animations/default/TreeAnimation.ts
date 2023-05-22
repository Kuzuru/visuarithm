import type { Tree } from "@/app/structures/Tree";

export abstract class TreeAnimation {
	tree: Tree;
	valueToFind: number;
	steps: (() => Promise<void>)[];
	stopExecution: boolean;

	protected constructor(tree: Tree, valueToFind: number) {
		this.tree = tree;
		this.stopExecution = false;
		this.valueToFind = valueToFind;
		this.steps = [];
	}

	abstract createSteps(): void;

	async start() {
		this.createSteps();
		for (const step of this.steps) {
			// If got stopExecution flag, stop execution
			if (this.stopExecution) {
				break;
			}

			await step();
		}
	}
}
