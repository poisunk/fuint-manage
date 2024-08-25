import { defineStore } from "pinia";

interface TagView {
    name: string;
    path: string;
}

export const useTagsViewStore = defineStore("tagsView", {
    state: () => {
        return {
            visitedViews: [],
        }
    },

    actions: {
        addView(view: TagView) {
            this.addVisitedView(view);
        },

        addVisitedView(view: TagView) {
            if (this.visitedViews.some((v: TagView) => v.path === view.path)) return;
            this.visitedViews.push({
                name: view.name,
                path: view.path
            });
        },

        delView(view: TagView) {
            for (const [i, v] of this.visitedViews.entries()) {
                if (v.path === view.path) {
                    this.visitedViews.splice(i, 1);
                    break;
                }
            }
        }
    },

    persist: {
        enabled: true,
    }
});