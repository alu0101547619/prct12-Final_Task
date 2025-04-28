import express from 'express';
import mongoose from 'mongoose';
import { Funko } from './funko.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/funko', (req, res) => {
  const funko = new Funko(req.body);

  funko.save().then((funko) => {
    res.status(201).send(funko);
  }).catch((error) => {
    res.status(400).send(error);
  });
});

app.get('/funko', (req, res) => {
  const filter = req.query.ID?{ID: req.query.ID.toString()}:{};

  Funko.find(filter).then((funko) => {
    if (funko.length !== 0) {
      res.send(funko);
    } else {
      res.status(404).send();
    }
  }).catch(() => {
    res.status(500).send();
  });
});

app.patch('/funko', (req, res) => {
  if (!req.query.ID) {
    res.status(400).send({
      error: 'A title must be provided in the query string',
    });
  } else if (!req.body) {
    res.status(400).send({
      error: 'Fields to be modified have to be provided in the request body',
    });
  } else {
    const allowedUpdates = ['ID', 'name', 'description', 'type','gender', 'theme', 'num', 'exclusive', 'special_characteristics', 'value'];
    const actualUpdates = Object.keys(req.body);
    const isValidUpdate =
      actualUpdates.every((update) => allowedUpdates.includes(update));

    if (!isValidUpdate) {
      res.status(400).send({
        error: 'Update is not permitted',
      });
    } else {
      Funko.findOneAndUpdate({ID: req.query.ID}, req.body, {
        new: true,
        runValidators: true,
      }).then((funko) => {
        if (!funko) {
          res.status(404).send();
        } else {
          res.send(funko);
        }
      }).catch((error) => {
        res.status(400).send(error);
      });
    }
  }
});

app.delete('/funko', (req, res) => {
  if (!req.query.ID) {
    res.status(400).send({
      error: 'A title must be provided',
    });
  } else {
    Funko.findOneAndDelete({ID: req.query.ID.toString()}).then((funko) => {
      if (!funko) {
        res.status(404).send();
      } else {
        res.send(funko);
      }
    }).catch(() => {
      res.status(400).send();
    });
  }
});

app.all('/{*splat}', (_, res) => {
  res.status(501).send();
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});