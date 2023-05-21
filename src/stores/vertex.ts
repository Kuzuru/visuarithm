import { defineStore } from "pinia"
import type { Circle } from "@/app/objects/Circle";

export const useGraphStore = defineStore({
	id: 'graph',
	state: () => ({
		vertices: [] as Circle[],
	}),
	actions: {
		addVertex(vertex: Circle) {
			this.vertices.push(vertex);
		},

		removeVertex(vertexId: string) {
			const index = this.vertices.findIndex((v) => v.VertexID === vertexId);

			if (index !== -1) {
				this.vertices.splice(index, 1);
			}
		},
	},
});
