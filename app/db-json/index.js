const fs = require('fs');

class JsonDatabase {
    $dataTable = [];
    $fileDir = '';
    constructor (table) {
        this.$fileDir = __dirname +'/db/'+table+'.txt';
        if (!fs.existsSync(this.$fileDir)) {
            fs.writeFileSync(this.$fileDir, JSON.stringify([]), 'utf-8');
        }
        // writeFileSync
        const data = fs.readFileSync(this.$fileDir, 'utf-8');
        // Data
        this.$dataTable = JSON.parse(data);
    }

    get() {
        return this.$dataTable;
    }

    find(id) {
        return this.$dataTable.find(item => {
            return item.id == id;
        })
    }

    post(data) {
        // Set Id
        data.id = this.idIncrement();
        // Set timestamp
        data.created_at = this.getTimeNow();
        data.updated_at = this.getTimeNow();
        this.$dataTable.push(data);
        this.updateDatabase();
        return data;
    }

    put(data, id) {
        // Set timestamp
        data.updated_at = this.getTimeNow();
        let index = -1;
        this.$dataTable.forEach((item, i) => {
            if (item.id == id) {
                index = i;
            }
        });
        if (index >= 0) {
            this.$dataTable[index] = {...this.$dataTable[index], ...data};
            this.updateDatabase();
        }
        return this.$dataTable[index];
    }

    destroy(id) {
        let rowDelete = null;
        this.$dataTable.forEach((item, index) => {
            if (item.id == id) {
                rowDelete = {...this.$dataTable[index]}
                this.$dataTable.splice(index, 1);
            }
        });
        this.updateDatabase();
        return rowDelete;
    }

    idIncrement(){
        const lastIndex = this.$dataTable.length - 1;
        if (lastIndex < 0) {
            return 1;
        } else {
            const id = this.$dataTable[lastIndex].id + 1;
            return id;
        }
    }

    updateDatabase() {
        fs.writeFileSync(this.$fileDir, JSON.stringify(this.$dataTable), 'utf-8');
    }

    getTimeNow() {
        const date = new Date();
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
}
module.exports = JsonDatabase;