
class Helper {

    static convertDateForElWatan(date) {
        let parts = date.split(' ');
        parts.forEach(part=>{
           part = part.toString().replace(',','').replace(' ','')
        });
        let months=['janvier','février', 'mars', 'avril', 'mai', 'juin',
            'juillet', 'août','septembre','octobre','novembre','decembre'];

        let m = parseInt(months.findIndex(month=>{
            return month === parts[0];
        })) + 1 ;

        let month = ("0"+ m.toString()).slice(-2);
        return parseInt(parts[1]) + '/' + month + '/' + parts[2];
    }

    static shuffle(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }


}

module.exports = Helper;