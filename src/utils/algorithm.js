
class Node {
    constructor(x, y, g, h, fa) {
        this.x = x;
        this.y = y;
        this.g = g;
        this.h = h;
        this.fa = fa;
    }

    f() { return this.g + this.h; }
}

function heuristic(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}


// 停车点坐标
const parkPoints = [
    {id:1,x:12,y:0},
    {id:2,x:10,y:0},
    {id:3,x:8,y:0},
    {id:4,x:6,y:0},
    {id:5,x:4,y:0},
    {id:6,x:2,y:0},
    {id:7,x:0,y:0},
    {id:8,x:12,y:4},
    {id:9,x:10,y:4},
    {id:10,x:8,y:4},
    {id:11,x:4,y:4},
    {id:12,x:2,y:4},
    {id:13,x:0,y:4},
    {id:14,x:12,y:8},
    {id:15,x:10,y:8},
    {id:16,x:8,y:8},
    {id:17,x:4,y:8},
    {id:18,x:2,y:8},
    {id:19,x:0,y:8},
    {id:20,x:12,y:12},
    {id:21,x:10,y:12},
    {id:22,x:8,y:12},
    {id:23,x:6,y:12},
    {id:24,x:4,y:12},
    {id:25,x:2,y:12},
    {id:26,x:0,y:12},
]

// 障碍物坐标
const obstacles = new Set([
    [1, 0], [3, 0], [5, 0], [7, 0], [9, 0], [11, 0],
    [1, 4], [3, 4], [5, 4], [7, 4], [9, 4], [11, 4],
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5],
    [7, 5], [8, 5], [9, 5], [10, 5], [11, 5], [12, 5],
    [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7],
    [7, 7], [8, 7], [9, 7], [10, 7], [11, 7], [12, 7],
    [1, 8], [3, 8], [5, 8], [7, 8], [9, 8], [11, 8],
    [1, 12], [3, 12], [5, 12], [7, 12], [9, 12], [11, 12]
].map(coord => coord.toString()));

const dx = [0, 0, 1, -1];
const dy = [1, -1, 0, 0];
const size = 13

function run_algorithm(sx, sy, index) {

    const end = parkPoints[index-1]
    if (!Number.isInteger(sx) || !Number.isInteger(sy))
        alert("请设置起点");
     const ex = end.x;
    const ey = end.y;


    let find_path = false;
    let path = [];
    const vis = new Set();
    let dis = new Array(size * size);

    dis[sx * size + sy] = 0;
    let v = [new Node(sx, sy, 0, heuristic(sx, sy, ex, ey), null)];

    while (v.length) {
        let now = v[0];
        let nowInd = 0;
        for (let i = 1; i < v.length; i++) {
            if (v[i].f() < now.f()) {
                now = v[i];
                nowInd = i;
            }
        }
        console.log([now.x, now.y]);
        v.splice(nowInd, 1);
        nowInd = now.x * size + now.y;
        // console.log(nowInd);

        if (now.x == ex && now.y == ey) {
            find_path = true;
            while (now) {
                path.unshift([now.x, now.y]);
                now = now.fa;
            }
            break;
        }

        vis.add(nowInd);

        for (let i = 0; i < 4; i++) {
            let nx = now.x + dx[i];
            let ny = now.y + dy[i];
            let ind = nx * size + ny;

            if (nx < 0 || ny < 0 || nx >= size || ny >= size)
                continue;
            if (vis.has(ind) || obstacles.has([nx, ny].toString()))
                continue;

            let g = now.g + 1;
            let h = heuristic(nx, ny, ex, ey);

            if (dis[ind] === undefined || dis[ind] > dis[nowInd] + 1) {
                dis[ind] = dis[nowInd] + 1;
                v.push(new Node(nx, ny, g, h, now));
            }
        }
    }

    if (!find_path) return [];
    return path;
}
export default run_algorithm