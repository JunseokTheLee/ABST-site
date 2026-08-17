// Per-project galleries, keyed by the `data-project-gallery` attribute on
// each project page's <main>. `carousel` items are { src, alt } for the
// side-scrolling photo carousel (empty src -> placeholder tile, same as
// ABST_ACTIVITIES on the homepage).
//
// `artworks` items are { title, artist, thumb, image, images, video,
// description, artistCount, artistPhotos } for the clickable artwork grid.
// `thumb` is the small crop shown on the grid card. `image` is the single
// full artwork shown in the lightbox — separate files so the grid thumbnail
// can be a tight crop while the lightbox shows the whole piece. For a piece
// with more than one process/detail shot, use `images` (an array) instead
// of `image` and the lightbox media area becomes a mini carousel; `image`
// is ignored when `images` is set. `video`, if set, is a YouTube video ID
// or URL — it renders as an embedded player in the sidebar, below the
// description. `description` text and one photo per collaborating artist
// follow along the sidebar. `artistCount` is the number of artists
// credited on the piece (every ABST piece is normally a two-artist
// collaboration, but a few are solo); `artistPhotos` must have exactly
// that many paths, in the same order as the names in `artist`. Empty
// thumb/image/photo entries render a placeholder tile; an empty `video`
// renders nothing. Fill in real paths under images/ as photos and artwork
// scans come in — artist photo paths are slugged by name, so the same
// artist appearing on multiple pieces reuses one file.
const ABST_PROJECT_GALLERIES = {
  storywall: {
    carousel: [
      { src: '../images/proj5.jpg', alt: 'ABST Story Wall — installation at Tamna Comprehensive Welfare Center for the Disabled' },
      { src: '../images/tam.jpg', alt: 'ABST Story Wall — framed catalogue pages on the wall' },
      { src: '../images/hover5.jpg', alt: 'ABST Story Wall — visitors reading the panels' }
    ],
    artworks: [
     ]
  },
  flatland: {
    carousel: [
      { src: '../images/carousels/flatland-01.jpg', alt: 'Flatland Dream — installation view at the Jeju International Peace Centre' },
      { src: '../images/carousels/flatland-02.png', alt: 'Flatland Dream — opening night' },
      { src: '../images/carousels/flatland-03.png', alt: 'Flatland Dream — virtual gallery walkthrough' },
      { src: '../images/carousels/flatland-04.png', alt: 'Flatland Dream — collaborative pieces on display' },
      { src: '../images/carousels/flatland-05.jpg', alt: 'Flatland Dream — collaborative pieces on display' },
      { src: '../images/carousels/flatland-06.jpg', alt: 'Flatland Dream — collaborative pieces on display' }
    ],
    artworks: [
      { title: 'Flatland', artist: 'Junseok Lee', thumb: '../images/artworks/flatland/thumbs/junseok-flatland.png', images: ['../images/artworks/full/flatland-01-1.jpg', '../images/artworks/full/flatland-01-2.jpg', '../images/artworks/full/flatland-01-3.jpg'], video: 'https://www.youtube.com/watch?v=SrUVzZWSXH0', description: '', artistCount: 1, artistPhotos: ['../images/artists/인사말페이지사용_이준석_Junseok Lee.jpg'] },
      { title: 'Moving Art Gallery', artist: 'Junseok Lee', thumb: '../images/artworks/flatland/thumbs/junseok-gallery.png', images: ['../images/artworks/full/flatland-02-1.jpg', '../images/artworks/full/flatland-02-2.jpg', '../images/artworks/full/flatland-02-3.jpg'], video: '', description: '', artistCount: 1, artistPhotos: ['../images/artists/인사말페이지사용_이준석_Junseok Lee.jpg'] },
      { title: 'The Face of a Zebra, Zebra', artist: 'Yongwon Kim, Siwoo Yang ', thumb: '../images/artworks/flatland/thumbs/yongwon.png', image: '../images/artworks/flatland/full/Yongwon.png', description: '', artistCount: 2, artistPhotos: ['../images/artists/yongwon-kim.png', '../images/artists/siwoo-yang.png'] },
      { title: ' Blue Night, Cabin in the Forest', artist: 'Sun Lee, Yeolim Yang', thumb: '../images/artworks/flatland/thumbs/Yeolim.png', image: '../images/artworks/flatland/full/yeolim.png', description: '', artistCount: 2, artistPhotos: ['../images/artists/sun-lee.png', '../images/artists/양여림_NMH - Yeolim Yang - 2028.jpg'] },
      { title: ' The Snake Holding Starlight, Blue Sly', artist: 'Andre, Harang Choi', thumb: '../images/artworks/flatland/thumbs/Andre.png', image: '../images/artworks/flatland/full/harang.png', description: '', artistCount: 2, artistPhotos: ['../images/artists/andre.png', '../images/artists/harang-choi.png'] },
      { title: 'Golden City, Daylight Forest Village', artist: 'Woojin Son, Jeongmin Lee', thumb: '../images/artworks/flatland/thumbs/Woojin.png', image: '../images/artworks/flatland/full/woojin.png', description: '', artistCount: 2, artistPhotos: ['../images/artists/woojin-son.png', '../images/artists/jeongmin-choi.png'] },
      { title: 'Daily Life of Mamelping, The Beauty in My Mind', artist: 'Sieun Park, Dahye Lim', thumb: '../images/artworks/flatland/thumbs/Sieun.png', image: '../images/artworks/flatland/full/Sieun-dahye.png', description: '', artistCount: 2, artistPhotos: ['../images/artists/Sieun-park.png', '../images/artists/dahye-lim.png'] },
      { title: ' Resembling Flowers, Sunflower', artist: 'Jaeyong Choi, Sunghyun Kim', thumb: '../images/artworks/flatland/thumbs/jaeyong-sunghyun.png', image: '../images/artworks/flatland/full/jaeyong-sunghyun.png', description: '', artistCount: 2, artistPhotos: ['../images/artists/Jaeyong-Choi.png', '../images/artists/김성현_NLCS - Andy Kim.jpg'] },
      { title: 'My Friends Came to Visit My House, My Friends Also Came to Visit', artist: 'Jaeyong Choi, Zion Choi', thumb: '../images/artworks/flatland/thumbs/jaeyong-zion.png', image: '../images/artworks/flatland/full/jaeyong-zion.png', description: '', artistCount: 2, artistPhotos: ['../images/artists/Jaeyong-Choi.png', '../images/artists/최시온_NLCS - Zion Choi.jpg'] },
      { title: 'My Family, Running Towards My Family', artist: 'Sun Lee, Minjae Kang ', thumb: '../images/artworks/flatland/thumbs/minjae.png', image: '../images/artworks/flatland/full/minjae.png', description: '', artistCount: 2, artistPhotos: ['../images/artists/sun-lee.png', '../images/artists/강민재_NLCS - Minjae Kang.jpeg'] },
      { title: 'The Lost Crocodile, In the Sea There Are Crocodiles', artist: 'Kim Nayoon, Kim Eungku', thumb: '../images/artworks/flatland/thumbs/nayun.png', image: '../images/artworks/flatland/full/Nayun-Eungku.png', description: '', artistCount: 2, artistPhotos: ['../images/artists/nayun-kim.png', '../images/artists/eungku.jpeg'] }
    ]
  },
  flatlandnlcs: {
    carousel: [
      { src: '../images/flatland-nlcs1.jpg', alt: 'NLCS Jeju students installing their work' },
      { src: '../images/flatland-nlcs2.jpg', alt: 'NLCS Jeju students at the exhibition opening' },
      { src: '../images/flatland-nlcs3.jpg', alt: 'NLCS Jeju collaborative pieces on display' }
    ],
    artworks: [
      { title: 'Untitled', artist: 'Lee Jun-seok', thumb: '../images/artworks/thumbs/flatlandnlcs-01.jpg', image: '../images/artworks/full/flatlandnlcs-01.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/인사말페이지사용_이준석_Junseok Lee.jpg'] },
      { title: 'Untitled', artist: 'Kang Min-jae', thumb: '../images/artworks/thumbs/flatlandnlcs-02.jpg', image: '../images/artworks/full/flatlandnlcs-02.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/강민재_NLCS - Minjae Kang.jpeg'] },
      { title: 'Untitled', artist: 'Kim Sung-hyun', thumb: '../images/artworks/thumbs/flatlandnlcs-03.jpg', image: '../images/artworks/full/flatlandnlcs-03.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/김성현_NLCS - Andy Kim.jpg'] },
      { title: 'Untitled', artist: 'Kim Eung-gu', thumb: '../images/artworks/thumbs/flatlandnlcs-04.jpg', image: '../images/artworks/full/flatlandnlcs-04.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/eungku.jpeg'] },
      { title: 'Untitled', artist: 'Choi Ha-rang', thumb: '../images/artworks/thumbs/flatlandnlcs-05.jpg', image: '../images/artworks/full/flatlandnlcs-05.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/harang-choi.png'] },
      { title: 'Untitled', artist: 'Choi Si-on', thumb: '../images/artworks/thumbs/flatlandnlcs-06.jpg', image: '../images/artworks/full/flatlandnlcs-06.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/최시온_NLCS - Zion Choi.jpg'] },
      { title: 'Untitled', artist: 'Lee Jung-min', thumb: '../images/artworks/thumbs/flatlandnlcs-07.jpg', image: '../images/artworks/full/flatlandnlcs-07.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/jeongmin-choi.png'] },
      { title: 'Untitled', artist: 'Lim Da-hye', thumb: '../images/artworks/thumbs/flatlandnlcs-08.jpg', image: '../images/artworks/full/flatlandnlcs-08.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/dahye-lim.png'] },
      { title: 'Untitled', artist: 'Yang Si-woo', thumb: '../images/artworks/thumbs/flatlandnlcs-09.jpg', image: '../images/artworks/full/flatlandnlcs-09.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/siwoo-yang.png'] },
      { title: 'Untitled', artist: 'Yang Yeo-rim', thumb: '../images/artworks/thumbs/flatlandnlcs-10.jpg', image: '../images/artworks/full/flatlandnlcs-10.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/양여림_NMH - Yeolim Yang - 2028.jpg'] }
    ]
  },
  cradle: {
    carousel: [
      { src: '../images/carousels/cradle-01.jpg', alt: 'Cradle — process photo' },
      { src: '../images/carousels/cradle-02.jpg', alt: 'Cradle — process photo' },
      { src: '../images/carousels/cradle-03.jpg', alt: 'Cradle — process photo' }
    ],
    artworks: [
      { title: 'Cradle', artist: 'Junseok Lee', thumb: '../images/cradle.png', images: ['../images/cradle.png', '../images/artworks/cradle/full/cradle-01-2.png', '../images/artworks/cradle/full/cradle-01-3.jpg'], video: 'https://www.youtube.com/watch?v=SrUVzZWSXH0', description: '', artistCount: 1, artistPhotos: ['../images/artists/인사말페이지사용_이준석_Junseok Lee.jpg'] },
      { title: "Reality, Threshold", artist: "Woojin Son, Hyuna Sung", thumb: '../images/artworks/cradle/thumbs/Woojin Son _Hyuna Sung.png', image: '../images/artworks/cradle/full/Woojin Son _Hyuna Sung_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/woojin-son.png", "../images/artists/hyuna-sung.png"] },
      { title: "Melody of the Guitar, The Child Who Tunes the Light", artist: "Hyunjun Ko, Jiwoon Bae", thumb: '../images/artworks/cradle/thumbs/Hyunjun Ko _Jiwoon Bae.png', image: '../images/artworks/cradle/full/Hyunjun Ko _Jiwoon Bae_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/hyunjun-ko.jpg", "../images/artists/Jiwoon-Bae.jpg"] },
      { title: "Sunflower, Sunflowers", artist: "Yuna Lee, Yeeun Kim", thumb: '../images/artworks/cradle/thumbs/Yuna Lee_Yeeun Kim.png', image: '../images/artworks/cradle/full/Yuna Lee_Yeeun Kim_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/yuna-lee.jpg", "../images/artists/yeeun-kim.jpg"] },
      { title: "A Pigeon Family Looking in the Mirror at Deoksugung, A Letter in Books to the Pigeons", artist: "Hae Lee, Seohyun Jey", thumb: '../images/artworks/cradle/thumbs/Hae Lee _Seohyun Jey.png', image: '../images/artworks/cradle/full/Hae Lee _Seohyun Jey_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/sun-lee.png", "../images/artists/seohyun Jey.jpg"] },
      { title: "Rush Hour Under the Sea, Aurora of the deep sea", artist: "Woogwan Song, Yeseul Choi", thumb: '../images/artworks/cradle/thumbs/Woogwan Song_Yeseul Choi.png', image: '../images/artworks/cradle/full/Woogwan Song_Yeseul Choi_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/Woogwan-song.jpg", "../images/artists/yeseul-choi.jpeg"] },
      { title: "The Unfading Mark, Lingering afterimage", artist: "Nayoon Kim, Yujoo Kim", thumb: '../images/artworks/cradle/thumbs/Nayoon Kim_Yujoo Kim.png', image: '../images/artworks/cradle/full/Nayoon Kim_Yujoo Kim_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/nayun-kim.png", "../images/artists/yujoo-kim.png"] },
      { title: "The instinct to run, Fast & Furious", artist: "Yongwon Kim, Zion Choi", thumb: '../images/artworks/cradle/thumbs/Yongwon Kim_Zion Choi.png', image: '../images/artworks/cradle/full/Yongwon Kim_Zion Choi_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/yongwon-kim.png", "../images/artists/최시온_NLCS - Zion Choi.jpg"] },
      { title: "SONINI, In Their Moment", artist: "Sieun Park, Gaon Park", thumb: '../images/artworks/cradle/thumbs/Sieun Park_Gaon Park.png', image: '../images/artworks/cradle/full/Sieun Park_Gaon Park_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/Sieun-park.png", "../images/artists/gaon-park.png"] },
      { title: "My friends went to a cafe to play., My friends also went to a cafe to play.", artist: "Jaeyong Choi, Dahyun Ryu", thumb: '../images/artworks/cradle/thumbs/Jaeyong Choi_Dahyun Ryu.png', image: '../images/artworks/cradle/full/Jaeyong Choi_Dahyun Ryu_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/Jaeyong-Choi.png", "../images/artists/dahyun-ryu.jpg"] },
      { title: "The Anglerfish’s Invitation, Adventure of an Anglerfish", artist: "Dre An, Seojung Hong", thumb: '../images/artworks/cradle/thumbs/Dre An_Seojung Hong.png', image: '../images/artworks/cradle/full/Dre An_Seojung Hong_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/andre.png", "../images/artists/Seojung-Hong.PNG"] },
      { title: "We Are Friends, One sunset, two eyes", artist: "Doeun Kim, Minjae Kang", thumb: '../images/artworks/cradle/thumbs/Doeun Kim_Minjae Kang.png', image: '../images/artworks/cradle/full/Doeun Kim_Minjae Kang_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/doeun-kim.jpg", "../images/artists/강민재_NLCS - Minjae Kang.jpeg"] },
      { title: "Illusion, May I", artist: "Woojin Son, Eunsuh Kim", thumb: '../images/artworks/cradle/thumbs/Woojin Son_Eunsuh Kim.png', image: '../images/artworks/cradle/full/Woojin Son_Eunsuh Kim_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/woojin-son.png", "../images/artists/Eunsuh-Kim.JPG"] },
      { title: "Mother and Me, Through My Mother’s Eyes", artist: "Hyunjun Ko, Heeseung Lee", thumb: '../images/artworks/cradle/thumbs/Hyunjun Ko_Heeseung Lee.png', image: '../images/artworks/cradle/full/Hyunjun Ko_Heeseung Lee_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/hyunjun-ko.jpg", "../images/artists/heeseung-lee.jpg"] },
      { title: "Flower Garden, To Mom", artist: "Yuna Lee, Minseo Kwak", thumb: '../images/artworks/cradle/thumbs/Yuna Lee_Minseo Kwak.png', image: '../images/artworks/cradle/full/Yuna Lee_Minseo Kwak_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/yuna-lee.jpg", "../images/artists/minseo-kwak.JPG"] },
      { title: "A deer playing the Radetzky March in front of Deoksugung Stone Wall Road, Nocturne", artist: "Hae Lee, Sunghyun Kim", thumb: '../images/artworks/cradle/thumbs/Sun Lee_Sunghyun Kim.png', image: '../images/artworks/cradle/full/Sun Lee_Sunghyun Kim_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/sun-lee.png", "../images/artists/김성현_NLCS - Andy Kim.jpg"] },
      { title: "A Midsummer Night's Gala, Below The Light", artist: "Woogwan Song, Jian Park", thumb: '../images/artworks/cradle/thumbs/Woogwan Song_Jian Park.png', image: '../images/artworks/cradle/full/Woogwan Song_Jian Park_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/Woogwan-song.jpg", "../images/artists/jian-park.jpeg"] },
      { title: "A Gesture of New Beginnings, Good Goodbye", artist: "Nayun Kim, Seongwon Yoon", thumb: '../images/artworks/cradle/thumbs/Nayun Kim_Seongwon Yoon .png', image: '../images/artworks/cradle/full/Nayun Kim_Seongwon Yoon _1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/nayun-kim.png", "../images/artists/윤성원_NLCS - Seongwon Yoon.JPG"] },
      { title: "Elephant of my sorrow, Temperature", artist: "Yongwon Kim, Eungku Kim", thumb: '../images/artworks/cradle/thumbs/Yongwon Kim_Eungku Kim.png', image: '../images/artworks/cradle/full/Yongwon Kim_Eungku Kim_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/yongwon-kim.png", "../images/artists/eungku.jpeg"] },
      { title: "Mother's Prayer, Boundless Love", artist: "Si-eun Park, Hyang Son", thumb: '../images/artworks/cradle/thumbs/Si-eun Park_Hyang Son.png', image: '../images/artworks/cradle/full/Si-eun Park_Hyang Son_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/Sieun-park.png", "../images/artists/Hyang-son.JPG"] },
      { title: "My friends went to Christmas Village to play, A Warm Christmas Night Together", artist: "Jaeyong Choi, Song Shin", thumb: '../images/artworks/cradle/thumbs/Jaeyong Choi_Song Shin.png', image: '../images/artworks/cradle/full/Jaeyong Choi_Song Shin_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/Jaeyong-Choi.png", "../images/artists/song-shin.png"] },
      { title: "Ocean SOS: Rescue the Anglerfish!, Calls from the deep sea", artist: "Dre An, Jade Koh", thumb: '../images/artworks/cradle/thumbs/ Dre An_Jade Koh.png', image: '../images/artworks/cradle/full/ Dre An_Jade Koh_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/andre.png", "../images/artists/jade-koh.png"] },
      { title: "Friends, No Matter What, Even though we live in different places, we're also friends.", artist: "Doeun Kim, Yeolim Yang", thumb: '../images/artworks/cradle/thumbs/Doeun Kim_Yeolim Yang.png', image: '../images/artworks/cradle/full/Doeun Kim_Yeolim Yang_1.png', description: '', artistCount: 2, artistPhotos: ["../images/artists/doeun-kim.jpg", "../images/artists/양여림_NMH - Yeolim Yang - 2028.jpg"] },
      { title: "Hungarian Dance Collaboration (Prelude)", artist: "Euigul Yang, Doyun Kim", thumb: '../images/artworks/cradle/thumbs/pianot.jpg', image: '../images/artworks/cradle/full/pianot.jpg', description: '', artistCount: 2, artistPhotos: ["../images/artists/Euigul-yang.jpg", "../images/artists/doyun-kim.jpg"] },
      { title: "Ludwig van Beethoven, Piano Sonata No. 8 in C minor, Op. 13 “Pathétique”, 3rd Movement", artist: "Euigul Yang", thumb: '../images/artworks/cradle/thumbs/euigul.jpg', image: '../images/artworks/cradle/full/euigul.jpg', description: '', artistCount: 1, artistPhotos: ["../images/artists/Euigul-yang.jpg"] },
      { title: "Johann Sebastian Bach Prelude and Fugue in G major, BWV 884 from The Well-Tempered Clavier, Book II", artist: "Doyun Kim", thumb: '../images/artworks/cradle/thumbs/doyun.jpg', image: '../images/artworks/cradle/full/doyun.jpg', description: '', artistCount: 1, artistPhotos: ["../images/artists/doyun-kim.jpg"] }
    ]
  },
  abstraction: {
    carousel: [
      { src: '../images/carousels/abstraction-01.jpg', alt: 'Abstraction — catalogue, prints, and merchandise on display' },
      { src: '../images/carousels/abstraction-02.jpg', alt: 'Abstraction — visitor viewing the virtual gallery walkthrough' },
      { src: '../images/carousels/abstraction-03.jpg', alt: 'Abstraction — interior of the virtual exhibition space' },
      { src: '../images/carousels/abstraction-04.jpg', alt: 'Abstraction — rendered artwork from the virtual gallery' }
    ],
    artworks: [
      { title: 'Artwork 01', artist: 'Artist name coming soon', thumb: '../images/artworks/thumbs/abstraction-01.jpg', image: '../images/artworks/full/abstraction-01.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/abstraction-artist-01.jpg'] },
      { title: 'Artwork 02', artist: 'Artist name coming soon', thumb: '../images/artworks/thumbs/abstraction-02.jpg', image: '../images/artworks/full/abstraction-02.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/abstraction-artist-02.jpg'] },
      { title: 'Artwork 03', artist: 'Artist name coming soon', thumb: '../images/artworks/thumbs/abstraction-03.jpg', image: '../images/artworks/full/abstraction-03.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/abstraction-artist-03.jpg'] },
      { title: 'Artwork 04', artist: 'Artist name coming soon', thumb: '../images/artworks/thumbs/abstraction-04.jpg', image: '../images/artworks/full/abstraction-04.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/abstraction-artist-04.jpg'] },
      { title: 'Artwork 05', artist: 'Artist name coming soon', thumb: '../images/artworks/thumbs/abstraction-05.jpg', image: '../images/artworks/full/abstraction-05.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/abstraction-artist-05.jpg'] },
      { title: 'Artwork 06', artist: 'Artist name coming soon', thumb: '../images/artworks/thumbs/abstraction-06.jpg', image: '../images/artworks/full/abstraction-06.jpg', description: '', artistCount: 1, artistPhotos: ['../images/artists/abstraction-artist-06.jpg'] }
    ]
  }
};
