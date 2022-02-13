let Url_Search = 'https://cs.wikipedia.org/w/api.php?action=opensearch&format=json&search=';
let Url_Thumbnail = 'https://cs.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&&pithumbsize=500&pageids=';
let Url_Random = 'https://cs.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=5';
let Url_SearchByWord = 'https://cs.wikipedia.org/w/api.php?action=query&format=json&prop=revisions&list=&meta=&rvprop=content&formatversion=2&rvslots=main&titles=';
let Url_Text = 'https://cs.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro=1&formatversion=2&explaintext=1&pageids=';


async function Random_Button()
{ 
  let Data;
  await random_Data(Url_Random,'')
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
    if(txtSentence[0].length < 40)
    {
      txt = txtSentence[0] + txtSentence[1];
    }
    else{txt = txtSentence[0];}

    console.log(title);
    console.log(id);
    console.log(txt);
    console.log(img);
  }
}

function split_to_sentences(txt)
{
  let x = [1,2,3,4,5,6,7,8,9,'I','V'];

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

function Built(title, text ,thumbnail)
{

}