let Url_Search = 'https://cs.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let Url_Thumbnail = 'https://cs.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&&pithumbsize=500&pageids=';
let Url_Random = 'https://cs.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=8';
let Url_SearchByWord = 'https://cs.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&list=&meta=&rvprop=content&formatversion=2&rvslots=main&titles=';
let Url_Text = 'https://cs.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&formatversion=2&explaintext=1&pageids=';
let Url_Wiki_Url = 'https://cs.wikipedia.org/wiki/'

let search_bool = false;

onLoad();

async function onLoad()
{
  while(document.getElementsByClassName("Element").length < 6)
  {
    await Random_Button();
  }
}


  window.onscroll = function() {
    if ((window.innerHeight + Math.ceil(window.pageYOffset)) >= document.body.offsetHeight) {
      if(search_bool == false)
      {
        Random_Button();
      }
    }
  }


function Button()
{
  search_bool = false;
  const main = document.getElementById("main");
  document.getElementById("input").value = "";
  main.innerHTML = '';
  onLoad();
}

async function Random_Button()
{ 
  
 
  let Data;
  await random_Data()
  .then(results => Data = results);

  read_Json_Random(Data);
}

async function random_Data()
{
  const response = await fetch(Url_Random + "&origin=*");
  const json =  await response.json();
  let data = json;
  return data;
}

async function search_name(word)
{
  const response = await fetch(Url_Search + word + "&origin=*");
  const json =  await response.json();
  let data = json;
  return data;
}

async function search_id(word)
{
  word = word.split(" ").join("_");
  word = word.split("&").join("%26");
  const response = await fetch(Url_SearchByWord + word + "&origin=*");
  const json =  await response.json();
  let data = json;
  return data;
}

async function get_txt_and_img_data(id)
{
  const text = await fetch(Url_Text + id + "&origin=*");
  const json_txt =  await text.json();
  let txt = 'err';
  if('extract' in json_txt.query.pages[0])
  {
    txt = json_txt.query.pages[0].extract;
  }

  const image = await fetch(Url_Thumbnail + id + "&origin=*");
  const json_img =  await image.json();
  let img = 'err';
  if('thumbnail' in json_img.query.pages[id])
  {
    img = json_img.query.pages[id].thumbnail.source;
  }

  return {txt, img};
}

async function read_Json_Random(id_data)
{
  for(let i = 0;i < id_data.query.random.length; i++) 
  {
    var id = id_data.query.random[i].id;
    var title = id_data.query.random[i].title;
    
    let data;
    await get_txt_and_img_data(id)
    .then(results => data = results);

    let img = 'img not found';
    let txt = 'txt not found';

    if(data.img != 'err')
    {
      img = data.img;
    }

    if(data.txt != 'err')
    {
      txt = data.txt;
    }

    let txtSentence = split_to_sentences(txt);
    if(txtSentence[0].length < 60)
    {
      txt = txtSentence[0] + txtSentence[1];
    }
    else{txt = txtSentence[0];}

    let url_title = title;

    url_title = url_title.split(" ").join("_");
    url_title = url_title.split("&").join("%26");

    let wiki_url = 'https://cs.wikipedia.org/wiki/' + url_title;

    Built(title,txt,img,false,wiki_url)
  }
}

async function read_id(id_data)
{
  let id = id_data.query.pages[0].pageid;
  let title = id_data.query.pages[0].title;

  let data;
    await get_txt_and_img_data(id)
    .then(results => data = results);

    let img = 'img not found';
    let txt = 'txt not found';

    if(data.img != 'err')
    {
      img = data.img;
    }

    if(data.txt != 'err')
    {
      txt = data.txt;
    }

    let txtSentence = split_to_sentences(txt);
    if(txtSentence[0].length < 60)
    {
      txt = txtSentence[0] + txtSentence[1];
    }
    else{txt = txtSentence[0];}

    let url_title = title;

    url_title = url_title.split(" ").join("_");
    url_title = url_title.split("&").join("%26");

    let wiki_url = 'https://cs.wikipedia.org/wiki/' + url_title;

    Built(title,txt,img,true,wiki_url)
  
}

async function search_for_id(data)
{
  for(let i = 0; i < data[1].length; i++)
  {
    let Data;
    await search_id(data[1][i])
  .then(results => Data = results);

  read_id(Data);
  }
  
}

function split_to_sentences(txt)
{
  let x = [1,2,3,4,5,6,7,8,9,'I','V','tzv','m','n','resp','-'];

  let txtArray = txt.split(".");
  let txtSentence = [];
  let Sentence = 0;

  for(let i = 0;i < txtArray.length - 1; i++) 
  {
  //  console.log('array:'+ txtArray[i]);
    if(txtArray[i].slice(-1) in x)
    {
      if(txtSentence[Sentence] == undefined)
      {
        txtSentence[Sentence] = txtArray[i] + '.';
      }
      else
      {
        txtSentence[Sentence] += txtArray[i] + '.';
      }
     // console.log('věta:'+ txtSentence[Sentence]);
     // console.log('ne');
    }
    else
    {
      if(txtSentence[Sentence] == undefined)
      {
        txtSentence[Sentence] = txtArray[i] + '.';
      }
      else
      {
        txtSentence[Sentence] += txtArray[i] + '.';
      }
    //  console.log('věta:'+ txtSentence[Sentence]);
      Sentence++;
    //  console.log('ano');
    }
  //  console.log('cislo:' + Sentence)
  }

  return txtSentence;
}

function Built(title, text ,thumbnail,search,url)
{
  if(search_bool == false || search)
  {

  const ElementDiv = document.createElement("div");
  ElementDiv.className = "Element";


  const txtDiv = document.createElement("div");
  txtDiv.className = "txt_flex";

  ElementDiv.appendChild(txtDiv);

  const href = document.createElement("a");

  href.setAttribute("href",url)
  href.setAttribute("target","_blank")

  const title_el = document.createElement("h1");
  const title_text = document.createTextNode(title);
  
  

  href.appendChild(title_text);
  title_el.append(href)
  txtDiv.appendChild(title_el);

  const text_el = document.createElement("p");
  const text_text = document.createTextNode(text);

  text_el.appendChild(text_text);

  txtDiv.appendChild(text_el);

  if(thumbnail != "img not found")
  {
  const thumbnail_img = document.createElement("img");
  thumbnail_img.src = thumbnail;
  thumbnail_img.className = "images";

  ElementDiv.appendChild(thumbnail_img);
  }

  document.getElementById("main").appendChild(ElementDiv);
}
}

async function Search()
{
  search_bool = true;
  const main = document.getElementById("main");
  main.innerHTML = '';

  let Data;
  await search_name(document.getElementById("input").value)
  .then(results => Data = results);

  search_for_id(Data);
}

var input = document.getElementById("input");
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   Search();
  }
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}