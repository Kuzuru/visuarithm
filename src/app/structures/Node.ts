import type { Circle } from "@/app/objects/Circle";

export class Node {
	data: number;
	children: Node[];
	circle: Circle | null;

	constructor(data: number) {
		this.data = data;
		this.children = [];
		this.circle = null;
	}

	addChild(node: Node) {
		// Ensure the node is not already in the tree
		if (this.children.find(child => child.data === node.data) === undefined) {
			this.children.push(node);
		}
	}
}