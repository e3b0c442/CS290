const express = require('express');
const moment = require('moment');
const workout = require('../db/workout');

const router = express.Router();

router.get('/', (req, res) => {
    workout.list().then((rows) => {
        res.status(200).send(rows);
    }).catch((err) => {
        res.status(500).send(err);
    })
});

router.post('/', (req, res) => {
    let ok = true;
    const data = {};
    ['name','reps','weight','date','lbs'].forEach((field) => {
        try {
            const validated = workout.validate(field, req.body[field]);
            data[field] = validated;
        } catch (err) {
            console.log(err);
            res.status(400).send({
                error: "Validation failed",
                detail: err
            });
            ok = false
        }
    });

    if(ok) {
        workout.insert(data).then((rows) => {
            res.status(200).send(rows);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }
});

router.post('/:workoutId', (req, res) => {
    let id;
    try {
        id = workout.validate("id", req.params.workoutId)
    } catch(err) {
        res.status(400).send({
            error: "Invalid ID",
            detail: `ID ${req.params.workoutId} does not exist or is invalid`
        });
        return;
    }

    let ok = true;
    const data = {};
    ['name','reps','weight','date','lbs'].forEach((field) => {
        try {
            const validated = workout.validate(field, req.body[field]);
            data[field] = validated;
        } catch (err) {
            console.log(err);
            res.status(400).send({
                error: "Validation failed",
                detail: err
            });
            ok = false
        }
    });

    if(ok) {
        workout.update(id, data).then((rows) => {
            res.status(200).send(rows);
        }).catch((err) => {
            res.status(500).send(err);
        });
    }
})

router.delete("/:workoutId", (req, res) => {
    let id;
    try {
        id = workout.validate("id", req.params.workoutId)
    } catch(err) {
        res.status(400).send({
            error: "Invalid ID",
            detail: `ID ${req.params.workoutId} does not exist or is invalid`
        });
        return;
    }

    workout.delete(id).then((rows) => {
        res.status(200).send(rows);
    }).catch((err) => {
        res.status(500).send(err);
    });
})

function reset(req, res) {
    workout.reset().then((rows) => {
        res.status(200).send(rows);
    }).catch((err) => {
        res.status(500).send(err);
    });
}

module.exports.router = router;
module.exports.reset = reset;