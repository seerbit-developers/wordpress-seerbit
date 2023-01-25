// /** @format */
//
// import pdfMake from "pdfmake/build/pdfmake";
// import pdfFonts from "pdfmake/build/vfs_fonts";
// pdfMake.vfs = pdfFonts.pdfMake.vfs;
//
// const processTransactionData = (transactions, points) => {
//   //First validate the transactions data
//   let transactions_array = [];
//   transactions_array.push(points[0]);
//   if (!transactions || transactions.length < 1) {
//     return false;
//   } else {
//     //Start processing here if validation passes
//
//     transactions.forEach((item) => {
//       const res = points[1].map((terms) => {
//         return display(item, terms);
//       });
//       transactions_array.push(res);
//     });
//
//     // return false;
//     let docDefinition = {
//       footer: function (currentPage, pageCount) {
//         return currentPage.toString() + " of " + pageCount;
//       },
//       pageOrientation: "landscape",
//       content: [
//         {
//           text: `Transactions Report`,
//           fontSize: 14,
//           bold: true,
//           margin: [0, 0, 0, 8],
//         },
//         {
//           text: `Printed on ${new Date().toLocaleDateString("EN")}`,
//           fontSize: 14,
//           bold: true,
//           margin: [0, 0, 0, 8],
//         },
//         {
//           style: "tableExample",
//           table: {
//             headerRows: 1,
//             // widths: [ '*', 'auto', 100, '*' ],
//             body: transactions_array,
//           },
//         },
//       ],
//       styles: {
//         header: {
//           fontSize: 18,
//           bold: true,
//           margin: [0, 0, 0, 10],
//           color: "#fff",
//           fillColor: "#333",
//         },
//         tableExample: {
//           margin: [0, 5, 0, 15],
//           fontSize: 11,
//         },
//         tableHeader: {
//           bold: true,
//           color: "white",
//           fillColor: "black",
//           fontSize: 10,
//         },
//         footer: {
//           textAlign: "center",
//         },
//       },
//     };
//
//     pdfMake.createPdf(docDefinition).download();
//   }
// };
//
// export default processTransactionData;
//
// const splitIndexes = (item, nodes, delimeter) => {
//   const res = nodes.map((data) =>
//     data.indexOf(".") ? carrage(item, data.split(".")) : item[data]
//   );
//   return res.join(delimeter);
// };
//
// const display = (item, terms) => {
//   return terms.pointer && terms.pointer.indexOf(".")
//     ? carrage(item, terms.pointer.split("."))
//     : terms.pointers
//     ? splitIndexes(item, terms.pointers[0].split(","), terms.pointers[1])
//     : item[terms.pointer];
// };
// const carrage = (item, point) => {
//   if (!point) return "";
//   else if (point.length === 1) return item[point[0]];
//   else if (point.length === 2) return item[point[0]][point[1]];
//   else if (point.length === 3) return item[point[0]][point[1]][point[2]];
//   else if (point.length === 4)
//     return item[point[0]][point[1]][point[2]][point[3]];
//   else if (point.length === 5)
//     return item[point[0]][point[1]][point[2]][point[3]][point[4]];
// };
