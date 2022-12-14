# MLASM
MLASM - Mindustry Logic Assembler.
Данный ассемблер является расширением классического ` mlog `, и предназначен для упрощённого программирования логики в игре.

Главное преимущество ` mlasm ` - возможность комфортной структуризации кода за счёт введения меток и инструкций перехода/возврата. 


## Особенности языка

### Комментарии
В ` mlasm ` для комментариев используются ` ; `, как в классических ассемблерах. Обратите внимание, что в классическом ` mlog ` для этого предназначен символ ` # `!

### Инструкция ` if <условие> <парам1> <парам2> `
Условный пропуск - работает аналогично стандартному `jump`, но в отличии от него, при выполнении условия просто пропускает последующую инструкцию, иначе исполняет её.

### Инструкция ` jmp <метка> `
Безусловный переход - Позволяет перенести выполнение к указанной метке.
Внимание, при неправильном использовании данная инструкция может легко нарушить стек вызовов и привести к непредсказуемому поведению программы!

### Инструкция ` call <метка> `
Вызов - Как и ` jmp ` производит переход к указанной метке, но в отличии от него сохраняет адрес возврата на стек вызовов.

### Инструкция ` halt `
Прерывание - Останавливает выполнение инструкций в текущем месте, и возвращается по последнему адресу возврата на стеке вызовов. Если стек вызовов пуст, возвращается в начало программы.

### Метки ` <метка>: `
Новая конструкция кода. Позволяет перемещаться по меткам при помощи инструкций ` jmp ` и ` call `.


## Требования

- Переменная ` _callstack_size ` зарезервирована.
- Переменная ` _return_address ` зарезервирована.
- К процессору должна быть подключена ячейка памяти ` cell1 ` необходимая для хранения стека вызовов.


## Как скомпилировать ` mlasm `?

Сохраните ваш код в файл ` main.mlasm ` , и положите его в папку одной из реализаций компилятора.
Далее, в зависимости от выбранной реализации, следуйте следующим инструкциям:

### nodejs:
Если вы на ПК:

- [Скачайте и установите приложение NodeJS](https://nodejs.org/en/)
- Откройте терминал ` Win+R, введите cmd (для Windows) `
- Перейдите в папку с компилятором ` cd <путь к репозиторию>/MLASM/nodejs `
- Запустите компилятор командой ` node index.js `
- Скопируйте текст из выходного файла ` out.mlog ` , вернитесь в игру и вставьте его в процессор.

Если вы на телефоне:

- Скачайте приложение Termux из вашего магазина приложений
- Запустите его и введите команду ` termux-setup-storage ` в терминал. Это позволит добраться до файлов и запустить компилятор далее
- Установите NodeJS следующей командой ` pkg install nodejs `
- Перейдите в папку с компилятором ` cd ~/storage/shared/<путь к репозиторию>/MLASM/nodejs `
- Запустите компилятор командой ` node index.js `
- Скопируйте текст из выходного файла ` out.mlog ` , вернитесь в игру и вставьте его в процессор.
