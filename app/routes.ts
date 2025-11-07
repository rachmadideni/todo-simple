import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    ...prefix("tasks", [
        layout("layouts/stack.tsx", [
            index("routes/task/task.tsx"),
            route("add", "routes/task/add.tsx")
        ])
    ]),
] satisfies RouteConfig;
