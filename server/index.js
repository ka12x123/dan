const express = require('express');
const app = express();
const port = 4000;
const DB = require("./DB/database.json");
const fs = require("fs").promises;

app.use(express.json());
const cors = require('cors');
app.use(cors());

app.get('/days', (req, res) => {
  fs.readFile("./DB/database.json", 'utf8')
    .then((data) => {
      const jsonData = JSON.parse(data);
      console.log(jsonData);
      res.json(jsonData.days);
    })
});

app.get("/words", (req, res) => {
  fs.readFile("./DB/database.json", 'utf8')
    .then((data) => {
      const jsonData = JSON.parse(data);
      const day = req.query.day;
      const filteredWords = jsonData.words.filter(word => word.day === Number(day)); //여기까지가 스토리지 담당 이건 그냥 스토리지로 끝내자
      res.json(filteredWords); 
    })
});

app.put('/word_screen', (req, res) => {
  fs.readFile("./DB/database.json", 'utf8')
    .then((data) => {
      const jsonData = JSON.parse(data); //json 형태를 js 객체 형태로 변환
      console.log(jsonData);
      const wordData = req.body.id;
      const targetObject = jsonData.words.find(word => word.id === wordData); //스토리지 담당
      const wordIndex = jsonData.words.indexOf(targetObject);
      jsonData.words[wordIndex].isDone = !targetObject.isDone; //이런식으로 객체 내용의 키에 접근 가능
      fs.writeFile("./DB/database.json", JSON.stringify(jsonData, null, 2), 'utf8'); //스토리지 정리 파일 담당
      res.json({ ok: true, message: 'Successfully updated word status' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Error updating word status' });
    });
});

app.post('/word_del', (req, res) => {
  fs.readFile("./DB/database.json", 'utf8')
    .then((data) => {
      const jsonData = JSON.parse(data);
      const wordData = req.body.id;
      const targetObject = jsonData.words.find(word => word.id === wordData);
      const wordIndex = jsonData.words.indexOf(targetObject);
      jsonData.words.splice(wordIndex, 1);
      return fs.writeFile("./DB/database.json", JSON.stringify(jsonData, null, 2), 'utf8');
    })
    .then(() => {
      res.json({ ok: true, message: 'Successfully updated word status' });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ ok: false, message: 'Error updating word status' });
    });
});

app.post('/words_jjang', (req, res) => {
  fs.readFile("./DB/database.json", 'utf8')
  .then((data) => {
    const wordData = req.body;
    const jsonData = JSON.parse(data);
    wordData.id = jsonData.words[jsonData.words.length - 1].id + 1;
    jsonData.words.push(wordData);
    fs.writeFile("./DB/database.json", JSON.stringify(jsonData, null, 2), 'utf8'); 
    res.json({ ok : true, msg : "단어가 저장되었습니다!!" });
  })
  .catch((err) => {
    console.log(err);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
                    