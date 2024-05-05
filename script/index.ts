/***************
 * Static Data *
 ***************/

interface pin {
    name: string,
    author: string,
    x: number,
    y: number,
    pid: string,
}

interface line {
    name: string,
    color: string,
    x: number[],
    y: number[],
    pid: (string | null)[],
    lid: string,
}

interface PriorityQueueNode {
    data: string;
    priority: number;
}

type Graph = {
    [node: string]: {
        [neighbor: string]: number;
    };
};

const TRAIN_SPEED = 420; // m/min

//   -------------[WARN]------------
// * xとyは1の位の桁を切り落とす
// * pidは[都市名_駅名]の形を使用する
// * 順番はあいうえお順

const pins: pin[] = [
    {name:"中海駅", author:"pizzaharumaki", x:223, y:-821, pid:"harumaki_chukai"},
    {name:"春座駅", author:"hosiharu", x:123, y:-471, pid:"haruza_haruza"},
]

//   -------------[WARN]------------
// * xとyは1の位の桁を切り落とす
// * lidは[会社名_路線名]の形を使用する
// * 順番はあいうえお順

const lines: line[] = [
    {name:"春晴本線", color: "blue", x:[243, 208, 164, 130, 123, 123], y:[-821, -831, -831, -831, -825, -471], pid:['harumaki_chukai', null, null, null, null, 'haruza_haruza'], lid:"syunse_main"},
]

/***************
 * Main Script *
 ***************/

let LOG = console.log;
let ERROR = console.error;

let tmp_x: number, tmp_y: number;
let isMouseDown: boolean;

// 優先キュー(要インスタンス化)
class PriorityQueue {
    private nodes: PriorityQueueNode[];

    constructor() {
        this.nodes = [];
    }

    enqueue(data: string, priority: number): void {
        this.nodes.push({data, priority});
        this.nodes.sort((a, b) => a.priority - b.priority);
    }

    dequeue(): PriorityQueueNode | undefined {
        return this.nodes.shift();
    }

    isEmpty(): boolean {
        return !this.nodes.length;
    }
}

// Canvas操作ユーティリティ
class CanvasHandler {
    static OFFSET_X = 1000;
    static OFFSET_Y = 1000;

    static local_x = 0;
    static local_y = 0;
    static local_size = 1;

    static cx = (ax: number) => (CanvasHandler.OFFSET_X+CanvasHandler.local_x+ax)*(CanvasHandler.local_size);
    static cy = (ay: number) => (CanvasHandler.OFFSET_Y+CanvasHandler.local_y+ay)*(CanvasHandler.local_size);

    static render() {
        LOG('Render Updated');
        CanvasHandler.clear();
        //for (let i = 0; i < pins.length; i++) {
        //    const e = pins[i];
        //}
        for (let j = 0; j < lines.length; j++) {
            const e = lines[j];
            CanvasHandler.lineRender(e.x, e.y, e.color);
        }
    }

    static clear() {
        LOG('Canvas Clear');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgb(230, 230, 230)";
        ctx.fillRect(0, 0, CanvasHandler.OFFSET_X * 2, CanvasHandler.OFFSET_Y * 2);
    }

    static lineRender(x: number[], y: number[], color: string) {
        LOG("RenderLine", x, y, color);
        CanvasHandler.strokeWidth(5);
        CanvasHandler.strokeStyle(color);
        ctx.beginPath();
        ctx.moveTo(CanvasHandler.cx(x[0]), CanvasHandler.cy(y[0]));
        for (let i = 1; i < x.length; i++) {
            ctx.lineTo(CanvasHandler.cx(x[i]), CanvasHandler.cy(y[i]));
        }
        ctx.stroke();
    }

    static dragstart(e: MouseEvent) {
        LOG("Start Drag");
        isMouseDown = true;
        tmp_x = e.offsetX;
        tmp_y = e.offsetY;
    }

    static dragupdate(e: MouseEvent) {
        LOG("Update Drag");
        if(isMouseDown) {
            if (tmp_x == undefined || tmp_y == undefined) {
                return;
            }
            let factor = 1 / CanvasHandler.local_size;
            CanvasHandler.local_x += (e.offsetX - tmp_x) * factor;
            CanvasHandler.local_y += (e.offsetY - tmp_y) * factor;
            tmp_x = e.offsetX;
            tmp_y = e.offsetY;
            CanvasHandler.render();
        }
    }

    static dragend(e: MouseEvent) {
        LOG("End Drag");
        isMouseDown = false;
    }

    static wheelzoom(e: WheelEvent) {
        LOG("Update WheelZoom");
        CanvasHandler.local_size += e.deltaY * -0.001;
        CanvasHandler.render();
    }

    static strokeStyle = (color: string) => ctx.strokeStyle = color;
    static strokeWidth = (width: number) => ctx.lineWidth = width;
}

// 経路計算ユーティリティ
class Directions {
    static get(fromid: string, toid: string) {
        LOG("Direction GET", fromid, toid);
        /*let {distances, previous} = Directions.dijkstra(Directions.generateNodeGraph(), fromid);
        return {distances: distances, path: Directions.getPath(previous, fromid, toid)};*/
        //return Directions.dijkstra(Directions.generateNodeGraph(), fromid)[toid];
    }

    /*static generateNodeGraph() {
        let graph: Graph = {}

        // ノードの初期化
        for (let pine of pins) {
            graph[pine.pid] = {}
        }

        // 路線ごとに通るノードのエッジを計算する
        for (let linee of lines) {
            for (let i = 0; i < linee.pid.length; i++) {
                let pin1 = linee.pid[i];
                let pin2 = linee.pid[i + 1];

                let pin1Details = pins.find(pin => pin.pid == pin1);
                let pin2Details = pins.find(pin => pin.pid == pin2);

                if (!pin1Details || !pin2Details) {
                   continue;
                }

                // ピン間のユークリッド距離(直線距離)を求める
                let distance = Math.sqrt(
                    Math.pow(pins.find(pin => pin.name == pin1)!.x - pins.find(pin => pin.name == pin2)!.x, 2) +
                    Math.pow(pins.find(pin => pin.name == pin1)!.y - pins.find(pin => pin.name == pin2)!.y, 2)
                );

                graph[pin1][pin2] = distance;
                graph[pin2][pin1] = distance;
            }
        }

        return graph;
    }*/

    //static dijkstra(graph: Graph, start: string)/*: {[node: string]: number}*/ {
        //LOG('dijkstra', graph, start);
        /*let distances: {[node: string]: number} = {};
        for (let node in graph) {
            distances[node] = Infinity;
        }
        distances[start] = 0;

        let queue: [number, string][] = [[0, start]];

        while (queue.length != 0) {
            queue.sort((a, b) => a[0] - b[0]);
            let [currentDistance, currentNode] = queue.shift() as [number, string];

            if (distances[currentNode] < currentDistance) {
                continue;
            }

            for (let neighbor in graph[currentNode]) {
                let distance = currentDistance + graph[currentNode][neighbor];

                if (distance < distances[neighbor]) {
                    distances[neighbor] = distance;
                    queue.push([distance, neighbor]);
                }
            }
        }

        return distances;*/
        /*let distances: {[node: string]: number} = {};
        let previous: {[node: string]: string} = {};
      
        for (let node in graph) {
          distances[node] = Infinity;
          previous[node] = '';
        }
        distances[start] = 0;
      
        let queue: [number, string][] = [[0, start]];
      
        while (queue.length != 0) {
          queue.sort((a, b) => a[0] - b[0]);
          let [currentDistance, currentNode] = queue.shift() as [number, string];
      
          if (distances[currentNode] < currentDistance) {
            continue;
          }
      
          for (let neighbor in graph[currentNode]) {
            let distance = currentDistance + graph[currentNode][neighbor];
      
            if (distance < distances[neighbor]) {
              distances[neighbor] = distance;
              previous[neighbor] = currentNode;
              queue.push([distance, neighbor]);
            }
          }
        }
      
        return {distances, previous};
    }*/

    /*static getPath(previous: {[node: string]: string}, start: string, end: string): string[] {
        LOG('getPath', previous, start, end);
        let path: string[] = [];
        for (let node = end; node != start; node = previous[node]) {
          path.unshift(node);
        }
        path.unshift(start);
        return path;
    }*/
    /*static getPath(previous: {[node: string]: string}, start: string, end: string): string[] {
        LOG('getPath', previous, start, end);
        let path: string[] = [];
        let visited: {[node: string]: boolean} = {};
        for (let node = end; node != start; node = previous[node]) {
            if (visited[node]) {
                throw new Error("Detected a loop from " + node);
            }
            path.unshift(node);
            visited[node] = true;
        }
        path.unshift(start);
        return path;
    }*/
}

// 経路結果コントロール
class DirectionsResult {
    static clear() {
        directionresults.innerHTML = "";
    }

    static add(html: string) {
        directionresults.insertAdjacentHTML('afterbegin', html);
    }
}

// テンプレート化されたHTMLの生成ユーティリティ
class HTMLBuilder {
    static directionResultCard(icon: "train" | "car", hour: number | null = null, min: number, distance: number, about: string, returnmethodname: string, returnmethodparam: string = "") {
        let i;
        switch (icon) {
            case "train":
                i = "t";
                break;
            case "car":
                i = "c";
                break;
        }
        return `<div class="di_res"><div><div class="i ${i}"></div><div><h3>${hour == null ? "" : `${hour}時間`}${String(min)}分 / ${distance}m</h3><p>${about}</p></div></div><div><a href="javascript:${returnmethodname}(${returnmethodparam});" class="s text">開始</a></div></div>`;
    }
}

let pinlist = document.getElementById('pointList') as HTMLDataListElement;
let directionresults = document.getElementById('directionresults') as HTMLDivElement;
let frompoint = document.getElementById('fromPoint') as HTMLInputElement;
let topoint = document.getElementById('toPoint') as HTMLInputElement;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
let main = document.getElementById('main') as HTMLElement;

let directionTab = document.getElementById('directions')!;
let informationTab = document.getElementById('information')!;

function resize() {
    LOG('Window Resized');
    canvas.width = CanvasHandler.OFFSET_X*2;
    canvas.height = CanvasHandler.OFFSET_Y*2;
    canvas.style.width = String(main.clientWidth) + "px";
    canvas.style.height = String(main.clientHeight) + "px";
    CanvasHandler.render();
}

function init() {
    resize();

    pins.forEach((v: pin, i: number, a: pin[]) => {
        pinlist.insertAdjacentHTML('afterbegin', `<option value="${v.name}" id="pin_${v.pid}"></option>`);
    });

    window.onresize = resize;

    canvas.addEventListener('mousedown', CanvasHandler.dragstart);
    canvas.addEventListener('mousemove', CanvasHandler.dragupdate);
    canvas.addEventListener('mouseup', CanvasHandler.dragend);
    canvas.addEventListener('wheel', CanvasHandler.wheelzoom);
}

init();

/*************
 * HTML Call *
 *************/

function reverseft() {
    let f = frompoint.value;
    let t = topoint.value;
    frompoint.value = t;
    topoint.value = f;
}

function outputresult() {
    if (frompoint.value == "" || topoint.value == "") {return;}
    let f: string, t: string;
    for(let i = 0; i < pins.length; i++) {
        if(pins[i].name === frompoint.value) {
            f = pins[i].pid;
            break;
        }
    }
    for(let i = 0; i < pins.length; i++) {
        if(pins[i].name === topoint.value) {
            t = pins[i].pid;
            break;
        }
    }
    /*let result = Directions.get(f!, t!);
    LOG(result);
    let realdistance = result.distances[t!] * 10;
    let min = realdistance / TRAIN_SPEED % 60;
    let hour: number | null = (realdistance / TRAIN_SPEED - min) / 60;
    if (hour == 0) {hour = null}
    DirectionsResult.add(HTMLBuilder.directionResultCard("train", hour, min, realdistance, "", "startNavi", ``));
    LOG(HTMLBuilder.directionResultCard("train", hour, min, realdistance, "", "startNavi", ``));*/
}

function startNavi() {
    //
}

function dismiss_donate() {
    document.getElementById('marumasa_donation')?.remove();
}

function tabDir() {
    directionTab.classList.remove('hide');
    informationTab.classList.add('hide');
}

function tabInfo() {
    informationTab.classList.remove('hide');
    directionTab.classList.add('hide');
}
