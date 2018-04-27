const request = require('request'); // 引入request
const jq = require('cheerio'); // 类似jq
const fs = require('fs-extra'); // 文件模块

let url = 'http://www.ivsky.com/tupian/qita/';
const dir = 'download'; // 放置图片的文件夹

const getResponce = url => {
    return new Promise((resolve, reject) => {
        request(url, (err, req) => {
            if (!err) {
                let html = req.body;
                const img_urls = [];
                const $ = jq.load(html, {
                    decodeEntities: false
                });
                $('.il_img>a>img').each((i, item) => {
                    img_urls.push({ name: item.attribs.alt, src: item.attribs.src });
                });
                resolve({ code: 200, data: img_urls });
            } else {
                resolve({ code: 400, err: err });
            }
        });
    });
};

const downLoad = (param) => {
    console.log(`download...${param.name},${param.src}`);
    request.get(param.src).pipe(
        fs.createWriteStream(`${dir}/${param.name}`)
    );
};

getResponce(url).then(res => {
    if (res.code === 200) {
        const img_urls = res.data;
        img_urls.forEach(param => downLoad(param));
    } else {
        console.log('error:', res.err);
    }
});