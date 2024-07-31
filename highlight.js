const fs = require('fs');
const path = require('path')
const Prism = require('prismjs');
const loadLanguages = require('prismjs/components/');
loadLanguages(['markdown', 'javascript']);


const rootDir =__dirname;
const pagesDir = path.join(rootDir, '/docs/pages');
const pages = fs.readdirSync(pagesDir, 'utf8');

pages.forEach((page)=>{
    const pagePath = path.join(pagesDir, `/${page}`);
    let pageContent = fs.readFileSync(pagePath, 'utf8');
    try {
        const pageName = page.split('.').shift();
        const pageCodesDir = path.join(rootDir, `/codes/${pageName}`)
        const codeFiles =  fs.readdirSync(pageCodesDir, 'utf8');
        codeFiles.forEach((file)=>{
            const regex = RegExp(`(<!--[ ]*CODE_${escapeRegExp(file)}[ ]*-->)(.*?)(<!--[ ]*CODE_${escapeRegExp(file)}[ ]*-->)`, 'gs');
            const matches = pageContent.match(regex);
            if(matches){
                let codeFileContent = fs.readFileSync(path.join(pageCodesDir, `/${file}`), 'utf8');
                const html = Prism.highlight(codeFileContent, Prism.languages.javascript, 'javascript');
                // codeFileContent = codeFileContent.replace(/\&/gs,'&amp;').replace(/</gs,'&lt;').replace(/>/gs,'&gt;');
                matches.forEach((match)=>{
                    pageContent = pageContent.replace(match,`\n<!-- CODE_${file} -->\n<pre><code>\n${html}\n</pre></code>\n<!-- CODE_${file} -->\n`);
                })
                
            }
        });
        codeFiles.length>0&&fs.writeFileSync(pagePath, pageContent, 'utf8');
    } catch (error) {
        console.log(error);
        
    }
})

/**
 * 
 * @param {string} value 
 */
function escapeRegExp(value) {
    return `${value}`.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
  }

// // The code snippet you want to highlight, as a string
// const code = `
// const Prism = require('prismjs');
// const loadLanguages = require('prismjs/components/');
// loadLanguages(['markdown']);
// const h = ()=>{}
// `;

// // Returns a highlighted HTML string
// const html = Prism.highlight(code, Prism.languages.javascript, 'javascript');

// console.log(html);

