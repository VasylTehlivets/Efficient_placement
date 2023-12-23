const fs = require("fs");

// Функція для зчитування вхідних даних з файлу
async function readInputFromFile(inputFile) {
  try {
    const data = fs.readFileSync(inputFile, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Помилка читання вхідного файлу:", error.message);
    throw error;
  }
}

// Функція для запису результатів у файл
function writeOutputToFile(outputFile, data) {
  try {
    const jsonData = JSON.stringify(data, null, 2);
    fs.writeFileSync(outputFile, jsonData);
  } catch (error) {
    console.error("Помилка запису вихідного файлу:", error.message);
    throw error;
  }
}

function packRectangles(rectangles, containerWidth, containerHeight) {
  rectangles.sort((a, b) => b.width - a.width);

  const container = {
    width: containerWidth,
    height: containerHeight,
    rectangles: [],
  };
  const unusedSpaces = [
    { x: 0, y: 0, width: containerWidth, height: containerHeight },
  ];

  rectangles.forEach((rectangle) => {
    let bestFit = null;

    for (let i = 0; i < unusedSpaces.length; i++) {
      const space = unusedSpaces[i];

      // Спроба розмістити прямокутник у вільному просторі
      if (rectangle.width <= space.width && rectangle.height <= space.height) {
        if (
          !bestFit ||
          space.width * space.height <
            bestFit.space.width * bestFit.space.height
        ) {
          bestFit = { index: i, space };
        }
      }
    }

    if (bestFit) {
      // Розміщення прямокутника у вільному просторі
      const { index, space } = bestFit;
      rectangle.x = space.x;
      rectangle.y = space.y;
      container.rectangles.push(rectangle);

      // Оновлення вільного простору
      unusedSpaces.splice(index, 1, ...getRemainingSpaces(space, rectangle));
    } else {
      console.log("Не вдалося розмістити прямокутник:", rectangle);
    }
  });

  return container.rectangles;
}

function getRemainingSpaces(space, placedRectangle) {
  const remainingSpaces = [];

  if (placedRectangle.x > space.x) {
    remainingSpaces.push({
      x: space.x,
      y: space.y,
      width: placedRectangle.x - space.x,
      height: space.height,
    });
  }

  if (placedRectangle.y > space.y) {
    remainingSpaces.push({
      x: space.x,
      y: space.y,
      width: space.width,
      height: placedRectangle.y - space.y,
    });
  }

  if (placedRectangle.x + placedRectangle.width < space.x + space.width) {
    remainingSpaces.push({
      x: placedRectangle.x + placedRectangle.width,
      y: space.y,
      width:
        space.x + space.width - (placedRectangle.x + placedRectangle.width),
      height: space.height,
    });
  }

  if (placedRectangle.y + placedRectangle.height < space.y + space.height) {
    remainingSpaces.push({
      x: space.x,
      y: placedRectangle.y + placedRectangle.height,
      width: space.width,
      height:
        space.y + space.height - (placedRectangle.y + placedRectangle.height),
    });
  }

  return remainingSpaces;
}

function area(rectangle) {
  return rectangle.width * rectangle.height;
}

function updateUI(result) {
  const container = document.getElementById("container");
  const fullness = document.getElementById("fullness");

  container.innerHTML = "";

  result.forEach((block, index) => {
    const blockElement = document.createElement("div");
    blockElement.className = "block";
    blockElement.style.width = block.width + "px";
    blockElement.style.height = block.height + "px";
    blockElement.style.top = block.y + "px";
    blockElement.style.left = block.x + "px";
    blockElement.style.backgroundColor = `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`;
    blockElement.innerText = `${index + 1}`;

    container.appendChild(blockElement);
  });

  fullness.innerText = `Коефіцієнт корисного використання простору: ${calculateFullness(
    result,
    inputData.container.width * inputData.container.height
  ).toFixed(2)}`;
}

function getRandomColor() {
  return Math.floor(Math.random() * 256);
}

function calculateFullness(rectangles, containerArea) {
  const usedArea = rectangles.reduce(
    (total, rectangle) => total + area(rectangle),
    0
  );
  return usedArea / containerArea;
}

// Основна функція для виконання завдань
async function main(inputFilePath, outputFilePath) {
  try {
    // Зчитування вхідних даних з файлу JSON
    const inputData = await readInputFromFile(inputFilePath);

    // Виклик функції розміщення прямокутників
    const result = packRectangles(
      inputData.rectangles,
      inputData.container.width,
      inputData.container.height
    );

    // Запис результатів у файл JSON
    writeOutputToFile(outputFilePath, result);
  } catch (error) {
    console.error("Помилка виконання програми:", error.message);
    process.exit(1);
  }
}

// Виклик основної функції
const inputFilePath = "input.json";
const outputFilePath = "output.json";
main(inputFilePath, outputFilePath);

// function packRectangles(rectangles, containerWidth, containerHeight) {
//   rectangles.sort((a, b) => b.width - a.width);

//   const container = {
//     width: containerWidth,
//     height: containerHeight,
//     rectangles: [],
//   };
//   const unusedSpaces = [
//     { x: 0, y: 0, width: containerWidth, height: containerHeight },
//   ];

//   rectangles.forEach((rectangle) => {
//     let bestFit = null;

//     for (let i = 0; i < unusedSpaces.length; i++) {
//       const space = unusedSpaces[i];

//       // Спроба розмістити прямокутник у вільному просторі
//       if (rectangle.width <= space.width && rectangle.height <= space.height) {
//         if (
//           !bestFit ||
//           space.width * space.height <
//             bestFit.space.width * bestFit.space.height
//         ) {
//           bestFit = { index: i, space };
//         }
//       }
//     }

//     if (bestFit) {
//       // Розміщення прямокутника у вільному просторі
//       const { index, space } = bestFit;
//       rectangle.x = space.x;
//       rectangle.y = space.y;
//       container.rectangles.push(rectangle);

//       // Оновлення вільного простору
//       unusedSpaces.splice(index, 1, ...getRemainingSpaces(space, rectangle));
//     } else {
//       console.log("Не вдалося розмістити прямокутник:", rectangle);
//     }
//   });

//   return container.rectangles;
// }

// function getRemainingSpaces(space, placedRectangle) {
//   const remainingSpaces = [];

//   if (placedRectangle.x > space.x) {
//     remainingSpaces.push({
//       x: space.x,
//       y: space.y,
//       width: placedRectangle.x - space.x,
//       height: space.height,
//     });
//   }

//   if (placedRectangle.y > space.y) {
//     remainingSpaces.push({
//       x: space.x,
//       y: space.y,
//       width: space.width,
//       height: placedRectangle.y - space.y,
//     });
//   }

//   if (placedRectangle.x + placedRectangle.width < space.x + space.width) {
//     remainingSpaces.push({
//       x: placedRectangle.x + placedRectangle.width,
//       y: space.y,
//       width:
//         space.x + space.width - (placedRectangle.x + placedRectangle.width),
//       height: space.height,
//     });
//   }

//   if (placedRectangle.y + placedRectangle.height < space.y + space.height) {
//     remainingSpaces.push({
//       x: space.x,
//       y: placedRectangle.y + placedRectangle.height,
//       width: space.width,
//       height:
//         space.y + space.height - (placedRectangle.y + placedRectangle.height),
//     });
//   }

//   return remainingSpaces;
// }

// function area(rectangle) {
//   return rectangle.width * rectangle.height;
// }

// function getRandomColor() {
//   return Math.floor(Math.random() * 256);
// }

// function calculateFullness(rectangles, containerArea) {
//   const usedArea = rectangles.reduce(
//     (total, rectangle) => total + area(rectangle),
//     0
//   );
//   return usedArea / containerArea;
// }

// function updateUI(result) {
//   const container = document.getElementById("container");
//   const fullness = document.getElementById("fullness");

//   container.innerHTML = "";

//   result.forEach((block, index) => {
//     const blockElement = document.createElement("div");
//     blockElement.className = "block";
//     blockElement.style.width = block.width + "px";
//     blockElement.style.height = block.height + "px";
//     blockElement.style.top = block.y + "px";
//     blockElement.style.left = block.x + "px";
//     blockElement.style.backgroundColor = `rgb(${getRandomColor()}, ${getRandomColor()}, ${getRandomColor()})`;
//     blockElement.innerText = `${index + 1}`;

//     container.appendChild(blockElement);
//   });

//   fullness.innerText = `Коефіцієнт корисного використання простору: ${calculateFullness(
//     result,
//     container.clientWidth * container.clientHeight
//   ).toFixed(2)}`;
// }

// // Отримуємо дані з output.json та викликаємо функцію візуалізації
// fetch("output.json")
//   .then((response) => response.json())
//   .then((data) => updateUI(data))
//   .catch((error) =>
//     console.error("Помилка читання output.json:", error.message)
//   );
