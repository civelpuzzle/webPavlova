/*Задание 1. Анкета пользователя
Создайте переменные для хранения имени пользователя, возраста и города проживания.
Выведите информацию в консоль в следующем формате:
Пользователь: Иван
Возраст: 20
Город: Москва */

const name = "Ivan";
const age = 20;
const city = "Moscow";

console.log(`Пользователь: ${name}\nВозраст: ${age}\nГород: ${city}\n`);

/*Задание 2. Проверка доступа к мероприятию
В городе проводится концерт с возрастным ограничением 16+.
Создайте переменную с возрастом посетителя и выведите сообщение:
«Вход разрешён», если возраст больше либо равен 16;
«Вход запрещён», если возраст меньше 16.
Используйте условный оператор. */

const userAge = 16;
if (userAge >= 16) {
  console.log("Вход разрешён\n");
} else {
  console.log("Вход запрещён\n");
};

/*Задание 3. Список покупок
Создайте массив продуктов, содержащий не менее пяти элементов.
Выведите каждый товар в консоль с помощью цикла.
Пример:
1. Хлеб
2. Молоко
3. Яблоки */

const productes = ["Хлеб", "Молоко", "Яблоки"];
for (const product of productes) {
  console.log(productes.indexOf(product) + 1 + ". " + product);
}; console.log();

/*Задание 4. Добавление товара в корзину
Создайте массив товаров интернет-магазина.
Добавьте новый товар в конец массива с помощью метода push().
После добавления выведите обновленный список товаров. */

const basket = ["Фен", "Яйца"];
for (const i of basket) { console.log(basket.indexOf(i) + 1 + ". " + i) };
console.log();

basket.push("Шляпа для протирания LitEnergy");
for (const i of basket) { console.log(basket.indexOf(i) + 1 + ". " + i) };
console.log();

/*Задание 5. Каталог товаров
Создайте массив цен:
[150, 300, 450, 800]
С помощью метода map() создайте новый массив, в котором каждая цена будет увеличена на 20%.
Выведите исходный и новый массив. */

const prices = [150, 300, 450, 800];
for (const i of prices) { console.log(prices.indexOf(i) + 1 + ". " + i) };
console.log();

const newPrices = prices.map(nadbavka => nadbavka + nadbavka * 0.2);
for (const i of newPrices) { console.log(newPrices.indexOf(i) + 1 + ". " + i) };
console.log();

/*Задание 6. Поиск товара
Создайте массив товаров:
["Ноутбук", "Мышь", "Клавиатура", "Монитор"]
Используя метод find(), найдите товар «Монитор».
Выведите найденное значение в консоль. */

const searchItem = ["Ноутбук", "Мышь", "Клавиатура", "Монитор"];
for (const i of searchItem) { console.log(searchItem.indexOf(i) + 1 + ". " + i) };
console.log(searchItem.find(search => search === "Монитор")); console.log();

/*Задание 7. Информация о студенте
Создайте объект, содержащий информацию о студенте:
имя;
группа;
курс.
Выведите все свойства объекта в консоль. */

const vova = {
  name: 'Владимир Евсратов',
  group: 'ИС-43',
  kurs: 'Четыре'
};
for (const i in vova) {
  console.log(`${i}: ${vova[i]}`);
}; console.log();

/*Задание 8. Электронный дневник
Создайте объект, содержащий данные об ученике:
{
    name: "Анна",
    grade: 4
}
Добавьте новое свойство:
attendance: "100%"
После добавления выведите объект в консоль. */

const anna = {
  name: "Анна",
  grade: 4
};

for (const i in anna) {
  console.log(`${i}: ${anna[i]}`);
}; console.log();

anna.attendance = "100%";

for (const i in anna) {
  console.log(`${i}: ${anna[i]}`);
}; console.log();

/*Задание 9. Расчет стоимости заказа
Создайте функцию, которая принимает цену товара и количество единиц товара.
Функция должна возвращать итоговую стоимость заказа.
Пример:
calculateOrder(500, 3);
Результат:
1500 */

const calculateOrder = (price, count) => price * count;
console.log("Результат: " + calculateOrder(500, 3)); console.log();

/*Задание 10. Интернет-магазин
Создайте массив объектов, содержащих информацию о товарах.
Каждый товар должен иметь название, цену.
Пример:
{
    name: "Наушники",
    price: 2500
}
Создайте не менее трёх объектов.
Выведите название и цену каждого товара с помощью цикла. */

// function createZad9(name, price) {
//   const item = {
//     name: name,
//     price: price
//   };
//   return item;
// }

const createZad9 = (name, price) => item = { name: name, price: price };

const massiveZad9 = [
  createZad9("Наушники", 2500),
  createZad9("Крутые наушники", 3000),
  createZad9("Ультра крутые наушники", 5000)
];

for (const i of massiveZad9) {
  console.log(`Название товара: ${i.name}, его цена: ${i.price}`);
}; console.log();

/*Задание 11.
Создайте массив объектов сотрудников компании.
Каждый сотрудник должен содержать имя, должность, заработную плату.
Необходимо вывести только тех сотрудников, чья заработная плата превышает 70000 рублей.
Для решения используйте метод filter(). */

const createPeople = (name, job, denga) => people = { name: name, job: job, denga: denga };

const massiveZad10 = [
  createPeople("Никита Пащенко", "Водолаз", 90000),
  createPeople("Владимир Евсратов", "Газонюх", 5000),
  createPeople("Лев Долгошеин", "Директор", 1000000)
];

const newZad10 = massiveZad10.filter(popa => popa.denga >= 70000);

for (const i of newZad10) {
  console.log(`Имя сотрудника: ${i.name} \nДолжность: ${i.job} \nЗП: ${i.denga}\n`);
};
