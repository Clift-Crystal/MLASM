const fs = require("fs");



// Конфигурация
inputfile = "./main.mlasm";
outputfile = "./out.mlog";



// Подготовка
let script = String(fs.readFileSync(inputfile)) + "\n";
let handle;
let table_labels = {};

function arr_tostr(array, from = 0) {
    let out = "";

    for (let i = from; i < array.length; i++)
        out += array[i] + " ";

    return out;
}

function str_ins(from, to) {
    let result = "";
    from = String(from);
    to = String(to);

    for (let i = 0; i < to.length; i++) {
        if (i < from.length) result += from[i];
        else result += to[i];
    }

    return result;
}



/**     Препроцессор
 * - Вычищает лишние символы
 * - Вычищает комментарии и пустые строки
 * - Обрабатывает директивы препроцессора
 */
console.log("= Препроцессор");
{
    let temp = "";
    let line = "";

    let flag_comment = false;
    for (let i = 0; i < script.length; i++) {
        let char = script[i];

        if (char == ";") {
            flag_comment = true;
            continue;
        }

        if (char == "\n" && flag_comment) {
            flag_comment = false;
            continue;
        }

        if (flag_comment) continue;
        if (char == "\r") continue;
        if (char == "\t") continue;
        if (char == " " && line == "") continue;

        if (char == "\n") {
            if (line == "") continue;

            temp += line + "\n";
            line = "";
            continue;
        }

        line += char;
    }

    handle = temp;
}



/**     Преобразователь
 * - Преобразует все особые конструкции кода в псевдо-инструкции
 */
 console.log("= Преобразователь");
{
    let temp = [];
    let ins = [];

    let token = "";
    for (let i = 0; i < handle.length; i++) {
        let char = handle[i];

        if (char == " ") {
            if (token == "") continue;
            ins.push(token);
            token = "";

            continue;
        }

        if (char == "\n") {
            if (token != "") {
                ins.push(token);
                token = "";
            }

            if (ins[0] == "_label") console.log("Метка " + ins[1]);

            temp.push(ins);
            ins = [];

            continue;
        }

        if (char == ":") {
            ins.push("_label");
            continue;
        }

        token += char;
    }

    handle = temp;
}



/**     Анализатор меток
 * - Генерирует таблицу меток, с учётом последующего преобразования псевдо-инструкций в обычные инструкции.
 * 
 */
console.log("= Анализатор переходов");
{
    let temp = [];

    let position = 2; // Кодогенератор в начало кода вставит две инструкции
    for (let i = 0; i < handle.length; i++) {
        let ins = handle[i];

        if (ins[0] == "_label") {
            table_labels[ins[1]] = position;
            console.log(ins[1] + ": " + position);
            continue;
        }

        if (ins[0] == "call") position += 4;
        if (ins[0] == "halt") position += 2;

        temp.push(ins);
        position++;
    }

    handle = temp;
}



/**     Кодогенератор
 * - Преобразует псевдо-инструкции в набор настоящих
 */
 console.log("= Кодогенератор");
{
    let temp = [];
    handle.unshift(["set", "_return_address", "0"]);
    handle.unshift(["set", "_callstack_size", "0"]);

    let position = 0;
    for (let i = 0; i < handle.length; i++) {
        let ins = handle[i];

        if (ins[0] == "if") {
            ins.shift();
            ins.unshift(position + 2);
            ins.unshift("jump");
        }

        if (ins[0] == "call") {
            temp.push(["op", "add", "_callstack_size", "_callstack_size", "1"]);
            temp.push(["set", "_return_address", "@counter"]);
            temp.push(["op", "add", "_return_address", "_return_address", "3"]);
            temp.push(["write", "_return_address", "cell1", "_callstack_size"]);
            temp.push(["set", "@counter", table_labels[ins[1]]]);
            position += 5;
            continue;
        }

        if (ins[0] == "jmp") ins = ["set", "@counter", table_labels[ins[1]]];

        if (ins[0] == "halt") {
            temp.push(["read", "_return_address", "cell1", "_callstack_size"]);
            temp.push(["op", "sub", "_callstack_size", "_callstack_size", "1"]);
            temp.push(["set", "@counter", "_return_address"]);
            position += 3;
            continue;
        }

        temp.push(ins);
        position++;
    }

    handle = temp;
}



/**     Сборщик
 * - Превращает временный массив в код mlog.
 */
 console.log("= Сборщик");
{
    let temp = "";

    let position = 0;
    for (let i = 0; i < handle.length; i++) {
        temp += arr_tostr(handle[i]) + "\n";
        console.log(str_ins(position, "    ") + " | " + arr_tostr(handle[i]));
        position++;
    }

    handle = temp;
}



// Сохранение результата
fs.writeFileSync(outputfile, handle);