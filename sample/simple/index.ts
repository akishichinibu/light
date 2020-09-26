import { Entry, Compoment, CompomentRegister, Render, Binding, Reference } from "../../src/main";
import * as _ from "lodash";
import * as ejs from "ejs";


// @CompomentRegister("taga")
// export class Tag1 extends Compoment {

//     @Reference({
//         xid: "tagb",
//     })
//     number: number;

//     @Render({
//         member: "sync",
//         render: (value: number, target: JQuery<HTMLElement>, parent: JQuery<HTMLElement>) => {
//             return '<%= value %>'
//             return value > 10000 ? `<b>${value}</b>` : `${value}`;
//         }
//     })
//     on_number(v: number) {
//         console.log(v);
//     }

//     on() {
//         console.log("base: ", this.snapshot);
//     }
// }


// @CompomentRegister("user_list")
// export class UserList extends Compoment {

//     @Reference({
//         xid: "tagb",
//     })
//     number: number;

//     @Render({
//         member: "ulist",
//         render: (value: number, target: JQuery<HTMLElement>, parent: JQuery<HTMLElement>) => {
//             const n = value % 30;
//             return _.range(0, n).map(r => `<option value="r">*${r}</option>`).join("")
//         }
//     })
//     on_number(v: number) {
//         console.log(v);
//     }
// }


// @CompomentRegister("tagb")
// export class Tag2 extends Compoment {

//     @Render({
//         member: "repeat",
//         render: (value: number, target: JQuery<HTMLElement>, parent: JQuery<HTMLElement>) => {
//             return value > 10000 ? `<b>${value}</b>` : `${value}`;
//         }
//     })
//     @Binding({
//         member: "user-input",
//         events: ["change", "input"],
//         traits: (target, _) => Number(target.val()),
//     })
//     number(v: number): number {
//         console.log("operate: ", v);
//         return null;
//     }
// }


// @CompomentRegister("tagc")
// export class SelectList extends Compoment {

//     @Binding({
//         member: "area",
//         events: ["change", "input"],
//         traits: (target, _) => Number(target.val()),
//     })
//     number(v: number): number {
//         console.log("operate: ", v);
//         return null;
//     }
// }


export class Demo extends Entry {

}

Demo.run();
