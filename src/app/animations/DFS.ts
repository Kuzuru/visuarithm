import { Color } from "three";
import type { Tree } from "@/app/structures/Tree";
import type { Node } from "@/app/structures/Node";
import type { Edge } from "@/app/objects/Edge";

export class DFS {
	private tree: Tree;
	private edges: Map<string, Edge>;
	private valueToFind: number;
	private steps: (() => Promise<void>)[] = [];

	constructor(tree: Tree, edges: Edge[], valueToFind: number) {
		this.tree = tree;
		this.edges = new Map();
		this.valueToFind = valueToFind;

		for (let i = 0; i < edges.length; i++) {
			const edge = edges[i];
			const edgeKey = this.edgeKey(edge.node1, edge.node2);
			this.edges.set(edgeKey, edge);
		}
	}

	createDFSSteps(node: Node | null) {
		if (!node) {
			return;
		}

		// this.steps.push(() => this.blinkNode(node, new Color(0x008000))); // green

		for (let i = 0; i < node.children.length; i++) {
			const child = node.children[i];

			this.steps.push(() => this.blinkNode(child, new Color(0x0000FF))); // blue

			// Blink edge with edge.line.blink()
			// TODO: Fix
			const edgeKey = this.edgeKey(node, child);
			const edge = this.edges.get(edgeKey);
			console.log(edge);

			if (edge) {
				console.log("DO BLINK")
				this.steps.push(() => edge.line.blink(new Color(0x0000FF), 1));
			}

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

	public addEdge(node1: Node, node2: Node, edge: Edge) {
		if (!edge) {
			throw new Error("Edge not found");
		}

		const edgeKey = this.edgeKey(node1, node2);
		this.edges.set(edgeKey, edge);
	}

	private edgeKey(node1: Node, node2: Node) {
		return `${Math.min(node1.data, node2.data)}-${Math.max(node1.data, node2.data)}`;
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
