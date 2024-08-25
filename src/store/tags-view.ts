import { defineStore } from "pinia";

export const useTagsViewStore = defineStore("tagsView", {
    state: () => {
        return {
            visitedViews: [],
            cachedViews: [],
        }
    },

    actions: {
        addView(view: any) {
            this.addVisitedView(view);
            this.addCachedView(view);
        },

        addVisitedView(view: any) {
            if (this.visitedViews.some((v: any) => v.path === view.path)) return;
            this.visitedViews.push(
                Object.assign({}, view, {
                    title: view.meta.title || "no-name",
                })
            );
        },

        addCachedView(view: any) {
            if (this.cachedViews.includes(view.name)) return;
            this.cachedViews.push(view.name);
        },

        delView(view: any) {
            for (const [i, v] of this.visitedViews.entries()) {
                if (v.path === view.path) {
                    this.visitedViews.splice(i, 1);
                    break;
                }
            }
        }
    },
});