var express = require('express');
var router = express.Router();

const JsonDatabase = require(__path_json);


router.get('/', (req, res, next) => {
    let table = new JsonDatabase('items');
    res.send({
        staus: 'success',
        records: table.get()
    });
});

router.get('/:id', (req, res, next) => {
    let table = new JsonDatabase('items');
    let result = table.find(req.params.id);
    if (result) {
        res.send({
            staus: 'success',
            record: result
        });
    } else {
        res.send({
            status: 'no_data',
            msg: 'Không có kết quả phù hợp'
        });
    }
});

router.post('/add', async (req, res, next) => {
    let table = new JsonDatabase('items');
    let data = req.body;
    const result = table.post(data);
    res.status(201).json({
        staus: 'create',
        data: result
    });
});

router.put('/eidt/:id', (req, res, next) => {
    let table = new JsonDatabase('items');
    const record = table.put(req.body, req.params.id);
    if (record) {
        res.send({
            staus: 'update',
            data: record
        });
    } else {
        res.send({
            status: 'no_data',
            msg: 'Không có kết quả phù hợp'
        });
    }
});

router.delete('/delete/:id', (req, res, next) => {
    let table = new JsonDatabase('items');
    const record = table.destroy(req.params.id);
    if (record) {
        res.send({
            staus: 'delete',
            data: record
        });
    } else {
        res.send({
            status: 'no_data',
            msg: 'Không có kết quả phù hợp'
        });
    }
});

module.exports = router;
