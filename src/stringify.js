// import global from "./global.js";
// const stringify = (obj, inh = null) => {
//     switch(typeof obj) {
//         case 'object':
//             if(Array.isArray(obj)) {
//                 let returning = '[';
//                 for(const item of obj) {
//                     returning += stringify(item) + ', ';
//                 }
//                 return returning + ']';
//             } else {
//                 let returning = '{';
//                 for(const item in obj) {
//                     if(global.propertyBlacklist.includes(item)) {
//                         continue;
//                     }
//                     if(inh !== null && obj[item] == inh[item]) {
//                         continue;
//                     }
//                     returning += `${item}: ${stringify(obj[item])}, `;
//                 }
//                 if(inh !== null) {
//                     return returning + `__proto__: ${obj.cName}.prototype, }.construct()`;
//                 }
//                 return returning + '}';
//             }
//         case 'string':
//             return `'${obj}'`;
//         default:
//             return `${obj}`;
//     }
// };
// export default stringify;