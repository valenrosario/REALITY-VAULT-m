import { Series, SocialLink, ComingSoonItem } from './types';

// =====================================================================
// ¡HOLA! ESTE ES EL PANEL DE CONTROL DE CONTENIDO (CMS)
// Aquí editas textos, imágenes y enlaces.
// =====================================================================

// 1. CONFIGURACIÓN GENERAL Y BARRA DE NOTICIAS
// ---------------------------------------------------------------------
export const APP_NAME = "REALITY VAULT"; 
export const APP_LOGO_URL = "https://img.icons8.com/clouds/200/tv.png";

// TEXTO QUE SE MUEVE ARRIBA (MARQUEE)
// Usa esto para anuncios importantes.
export const MARQUEE_TEXT = "✨ THE SIMPLE LIFE YA DISPONIBLE EN ESPAÑOL! ✨ SANASAAA ✨ THAT'S HOT! ✨";

// 2. REDES SOCIALES
// ---------------------------------------------------------------------
export const SOCIAL_LINKS: SocialLink[] = [
  { platform: "Instagram", url: "https://instagram.com/2000sreality", iconName: "instagram" },
  { platform: "TikTok", url: "https://www.tiktok.com/@2000stvreality", iconName: "tiktok" }
];

// 3. AVATARES DE REGISTRO
// ---------------------------------------------------------------------
export const AVATAR_OPTIONS = [
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSEiXK3YENGhyj7_Lmnb9qqZ7MnSubTfKrwgDiI10GUod-Ui9X-ugIu3OOtRe6Q8sQVXelCNY9ZYUZpQvCvOvp4M62MnDrAfkXNnZDG2__t3FylQPyrkXxjhY72jhr3KCm0P9ER4WSljWSc-Si2oc8NVjW2aSrNYw5U8oC93UxBJ5WWZTwwnZv2t2xB_k/s200/1.jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiv_JK_pIhMSgXVXEB2-r7j2d4g37Aq2TY0GPN0f-orn33_hKaDH_ETRs8Cs29t3pq_20W378-8YhLXk4kD-CgTNeZhmRMNKcsdtPcrzjDbTYZAtmz6RIqKmrMhKrbKwRsrHnmAYCHiYdtPoRmAQcZQoBl5-WlDUrXpOF4QHKnpVmtq8F2jGLQY8-NGbuM/s200/2.jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhh9baaV3dD-07EwR4K-aJL3Ax8qD6br-oK7MxzUxoOEUpOC9-BaGd86fva8LA2QJ4gffZJEoEKe8rW5qVajYrWe7csiUVZ-Nu5wLdOxBtSqtxlt8gNLzvCl_8FTRxcN7VX-HsJztDGCWJlp1vMtKBazj989JLeM6q1XJ4-7jIppRhrUQMr1nS3CD1WHBs/s200/4.jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZ6oQS7HpwU9rvzYYqfBIPqWT4OkkxiQ0jyCo1ji7V8ai6T5m2-iJ5_MMnibVAJgx7nFRVIpI-c9WF93L1-DXlIZ4ULRZCp-zG6MW792fblclLGTrCyti8ujOqhjwy5BgAM4OfWnW4giFo22ypcfWVF6VikFdQFzPB1wfWGCYUXUoRDTfmnSPJSDZRDH4/s200/3.jpg",
  "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgmX6Utcab_PRZ38FERafvX6vtoAuWvJ0li1EcZ-h2SQf6plDxkvzq_Qbrdd3m_32tuirNDQsbBnpuZrkEvxCLdkY1qHi8nGIsTHJvVKvfdCli_dahekbn2B-y-OM6ey0RmCqaI7YopioZtOA5r3FlRvrv-oB3AchbqNKk3Ph-Q3HeGVElhHqdWdn0nA94/s200/5.jpg",
];

// 4. (SECCIÓN ELIMINADA - YA NO SE USA COMING SOON DATA SEPARADA)
export const COMING_SOON_DATA: ComingSoonItem[] = [];

// 6. EFECTOS DE SONIDO (Y2K VIBES)
// ---------------------------------------------------------------------
export const SOUND_EFFECTS = {
  click: "https://cdn.pixabay.com/audio/2022/03/15/audio_c8c8a73467.mp3", // Bubble Pop
  nav: "https://cdn.pixabay.com/audio/2022/03/24/audio_8247d3c333.mp3",   // Swoosh
  success: "https://cdn.pixabay.com/audio/2022/03/10/audio_c23315053f.mp3" // Sparkle/Chime
};
export const SERIES_DATA: Series[] = [
  {
    id: "serie-1",
    title: "The Simple Life",
    logoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjEibg_WzrJ0FiRBrs4qo1STmXzMJUJpbGR7iIsZ9VTWUfK_sXNyOgOK9434tBbcHICqvGgRY15GjxNZ3HkxHNdJSq18evknpUfE3ZCjQDIAlHzYSkXlQxfQ5scShYhqwjKATiIuGb7dPieZ9mhG-ADm5p6R0DAp8SsNWkgvTa5Agtk0Ibt3dbe78yfZpg/s800/the%20simple%20life.png", 
    mobileLogoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi-nNFcS3ZwQiTELSm2vD4YjlSfr32JO9C-jyYkSXMS8-EpCt-d4U17lSnOFHM4SRHnDRRl6pxZ1pR2ERDUQYkeJ2mh_p8uFUavEHgaX_VQgZl-XMecwYwU58RhOZiIw48DlxTmsw9eyRTjcBQNVjNd4_KRMAYEhtLY8m6eQQqZhKhyphenhyphenma8w17UziwgB4I4/s1848/white.png",
    detailLogoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjEibg_WzrJ0FiRBrs4qo1STmXzMJUJpbGR7iIsZ9VTWUfK_sXNyOgOK9434tBbcHICqvGgRY15GjxNZ3HkxHNdJSq18evknpUfE3ZCjQDIAlHzYSkXlQxfQ5scShYhqwjKATiIuGb7dPieZ9mhG-ADm5p6R0DAp8SsNWkgvTa5Agtk0Ibt3dbe78yfZpg/s800/the%20simple%20life.png",
    mobileBannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiBRKKhnNEBXhcwx_l94I4UuBHFjpciKPGVSCfR4F_scRbZCZgK5UOFbVQeHnOOrQ8CI9lImMJTnjKHcxVft-olWC14nN9RMIHE0CA8zNYpAO5CkkRHVyo-I8E2400yW-zj3zSKYnMTWDL6qFSejYv_cIdLYwVcbTE2bbisqRBkZJ2NRM2bMr-Grvu_vpM/s2160/sss.png",
    year: "2003",
    themeColor: "#5b1b4b", // Deep Plum/Purple from screenshot
    coverImage: "https://image.tmdb.org/t/p/original/bXNd06zlKk2Pl7dF7PNq7tsGvje.jpg",
    // IMAGEN DE BANNER DESKTOP (Usada en el carrusel principal de inicio en PC)
    bannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgV2vOwdH8dhtYcuXWExWhyltP6vG_SjJggiWyTXsmrSnldzGmkSrOSm8xAXM-zkJcXFrgTsOOJczyIGL2cnZ-0SgeqmJl8L5RU7KH0yGhc6X4iRIWd-5zwv-cHLPxuMEETWb0yp2RsKWGKTggESNQxmvi7PfrEyW-ch9ji6y3wetdoaexWERVGXjtoW1w/s4053/ds2.png",
    // IMAGEN DE BANNER MÓVIL (Usada en el carrusel principal de inicio en Móvil, 1000x750)
    wideImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgGT0Ik1nQ5J3QBecy3ZXiMh0ItQBatLoQGw7jNjk3trIm5eljajmR0Of675MOnAtwTqQkseNfu0nX7zLd78BBQ1SHLN1XeClKge36m1H_da8PNj6Za_0YeByLJPkjgAFzI-oN0LVXDcwV-bRcFwoD55gMCYAOpr7cOxHUCA4_m8aSMEgl1ygngnSGRu8c/s800/hover%201.jpg",
    detailBannerDesktop: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhA0gOaK8Qpb-Nh-7gsS0Cb4PrC7pAQEh8iHOV2bs3O2OdHTX2EnGqrY53G2kcKX6laTYlCjjWe87o2g0Gp8bL0hnjQerd1gkCO7SOnM3Ec8wGXyTl8ON5BocpAY2ZMpmFRwA-XgxxfjCl3Fg0PQj6Li5JjvshjaKgUb9_KFy2IDDHekkUG_gCANz3pTC4/s1920/25.jpg",
    detailBannerMobile: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiXYOlvfO-cuhlqkMe_cyC3tQQwDYG1Vsu53JrRiBnPzN5rX59ThtxpISQdM11dFkWqVtPg0DVVPvSURyEInhnigTCNA8X51mzyzvOwEmvlrnav6U3tfipQvcHgTO4oL2_b6QZ2KnsUr8UJn0j2elOsAZv8rY3x901K1BRO8EgI1HnYqfIlLk7TaLVKZps/s1920/1.jpg",
    description: "Dos mejores amigas dejan el lujo para trabajar en una granja. Drama, risas y mucha moda Y2K.",
    aboutDescription: "The Simple Life es una serie de telerrealidad estadounidense protagonizada por Paris Hilton y Nicole Richie. La serie muestra a dos ricas socialités, Hilton y Richie, mientras luchan por hacer trabajos manuales y mal pagados como limpiar habitaciones, trabajar en granjas, servir comidas en restaurantes de comida rápida y trabajar como consejeras de campamento. La serie se estrenó el 2 de diciembre de 2003 en Fox y concluyó el 5 de agosto de 2007 en E!. La serie se convirtió en un fenómeno cultural, lanzando a Hilton y Richie al estrellato internacional.",
    bannerText: "Primera temporada ya disponible",
    tags: ["Reality", "Comedia", "Iconic"],
    cast: ["Paris Hilton", "Nicole Richie"],
    seasons: [
      {
        id: "s1",
        title: "Temporada 1",
        episodes: [
          {
            id: "s1e1",
            title: "Capítulo 1: Ro-dé-o vs. Ro-dí-o",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/320x180/p0kbvg7n.jpg",
            description: "Paris y Nicole disfrutan de su último día de libertad antes de ser enviadas a vivir a una granja en el medio de la nada",
            videoUrl: "https://drive.google.com/file/d/1Gao-55VIoPMmlIgJtP2WcjuR8dngg6CS/preview" 
          },
          {
            id: "s1e2",
            title: "Capítulo 2: Reinas de la lechería",
            duration: "22 min",
            thumbnail: "https://m.media-amazon.com/images/M/MV5BMTQwNzI2OTk2Ml5BMl5BanBnXkFtZTgwMjgxNTczMjE@._V1_.jpg",
            description: "Paris y Nicole comienzan su primer trabajo: ordeñar vacas en una granja lechera. Sin embargo, no están nada entusiasmadas con lo que el empleo implica, y pronto todo se sale de control",
            videoUrl: "https://drive.google.com/file/d/1PdolxnpAaaFTZf9pYsbMlQ6kLJkhCESR/preview?usp=drive_link"
          },
          {
            id: "s1e3",
            title: "Capítulo 3: Líos en el Sonic Burger",
            duration: "22 min",
            thumbnail: "https://m.media-amazon.com/images/M/MV5BMTk4MzEzOTExNl5BMl5BanBnXkFtZTgwNTUxNTczMjE@._V1_FMjpg_UX1000_.jpg", 
            description: "Tras su fracaso en la granja lechera, Paris y Nicole son contratadas para trabajar en un local de comida rápida y no tardan en causar estragos",
            videoUrl: "https://drive.google.com/file/d/1xyO4ASho-ERqYSddtBlrAvdSCNZCmTlq/preview?usp=drive_link"
          },
          {
            id: "s1e4",
            title: "Capítulo 4: El de los rumores",
            duration: "22 min",
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTtbsmsNFIZczKCI8Fl44BODq1UDa3Wif0PQ&s",
            description: "Después de visitar la oficina del alcalde para registrar a Tinkerbell, a Paris y Nicole les piden que presidan la gala anual de primavera de Altus. Ellas intentan aprovechar la oportunidad para encantar a los habitantes del pueblo y ganarse su simpatía (a su manera)",
            videoUrl: "https://drive.google.com/file/d/1PPIo8eK2kK8H6lKT9NYET7zlGrMI7jFj/preview?usp=drive_link"
          },
          {
            id: "s1e5",
            title: "Capítulo 5: Adictas a las compras",
            duration: "22 min",
            thumbnail: "https://m.media-amazon.com/images/M/MV5BMTc5MDIyMTQ3M15BMl5BanBnXkFtZTgwOTUxNTczMjE@._V1_.jpg",
            description: "Paris y Nicole comienzan un nuevo trabajo con unos subastadores de ganado. Pero cuando las envían a comprar alimento a un mayorista, deciden cargarlo todo a la cuenta de la casa de subastas, lo que desata una serie de problemas y confusiones financieras",
            videoUrl: "https://drive.google.com/file/d/1ETcV-H6DhsO9YVrwjdXTcIZi9hNIBQT1/preview?usp=sharing"
          },
          {
            id: "s1e6",
            title: "Capítulo 6: Locas por los chicos",
            duration: "22 min",
            thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThzgpGi76MTFS3JrM8NRhW86c3jm2x80tl8Q&s",
            description: "Paris y Nicole consiguen trabajo en una gasolinera local, donde comienzan a coquetear con los chicos del pueblo. Pronto empiezan a pasar cada día con dos chicos en particular, y la familia Leding no está para nada contenta",
            videoUrl: "https://drive.google.com/file/d/1lvNsVSwrCCdhDnuJS0vec8AiLsVgQqhN/preview?usp=sharing"
          },
          {
            id: "s1e7",
            title: "Capítulo 7: Adiós y buena suerte",
            duration: "22 min",
            thumbnail: "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2F4qyQ7BuhIC1LACsJzbFgyvUmGcN.jpg",
            description: "A medida que se acerca el último día de su viaje, Janet convence a Paris y Nicole de hacer las paces con las personas que ofendieron en Altus y de pagar sus deudas, mientras su despedida resulta ser más emotiva de lo que todos esperaban",
            videoUrl: "https://drive.google.com/file/d/1c61r7IPjAefmY_QAXW6CIy8yR2jdlkNg/preview?usp=sharing"
          },
          {
            id: "s1e8",
            title: "Episodio Especial: La Reunión",
            duration: "21 min",
            thumbnail: "https://static.tvmaze.com/uploads/images/large_landscape/316/790289.jpg",
            description: "Paris y Nicole se reencuantran con la familia Leding frente a una audiencia en vivo en Fort Smith, Arkansas. Junto a la presentadora Leeza Gibbons, todos discuten los momentos más polémicos, divertidos y escandalosos que ocurrieron durante la temporada",
            videoUrl: "https://drive.google.com/file/d/1UppYXnevkBg5uhoRzHDgP6MSUtDr-_yC/preview?usp=drive_link"
          },
          {
            id: "s1e9",
            title: "Capítulo 9: El Capitulo Perdido",
            duration: "22 min",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEho606oWJtSnb4EBxFznJIMaK5-L94UWBn1ElVO7h4hov1hhDlrTH1ND8geWgIxmLqiMl61zBoMWYZ1I3TVAz70iJobmIVCO0bAjoW9RZxqs3w3ySsoUKe_yRMAM3y6NgDlWLjuW_gX85B9drCEzpscV6dA3t2nQL2aRtvCXLWYAs2qZo16y9Hi6w4Bp4A/w945-h600-p-k-no-nu/p0kbvgdr.jpg",
            description: "Paris y Nicole extrañan su hogar, por lo que los padres de Paris les envían comida para reconfortarlas desde Los Ángeles. Mientras tanto, hay una alerta de tornado en Altus y las chicas trabajan con un taxidermista.",
            videoUrl: "https://drive.google.com/file/d/1K5b5a9C2fPvIz2OzTBwmptCmfEo7LORn/preview?usp=drive_link"
          }
        ]
      },
      {
        id: "s2",
        title: "Temporada 2: Road Trip",
        episodes: [
          {
            id: "s2e1",
            title: "Capítulo 1: El Viaje Comienza",
            duration: "20 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbvh1h.jpg",
            description: "Paris y Nicole dejan sus lujos atrás una vez más para emprender un viaje por carretera a través de Estados Unidos en una casa rodante rosa.",
            videoUrl: "https://drive.google.com/file/d/1XjY8RGNCtQxBuHP8IvLKLteIpReNLTeJ/view?usp=sharing"
          },
          {
            id: "s2e2",
            title: "Capítulo 2: Paseo de sirenas",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbvh2v.jpg",
            description: "Las chicas trabajan en el Weeki Wachee Springs en Florida, donde deben actuar como sirenas en un espectáculo acuático.",
            videoUrl: "https://www.youtube.com/embed/8Y7Wqerf78"
          },
          {
            id: "s2e3",
            title: "Capítulo 3: Resort Nudista",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbvh5t.jpg",
            description: "Paris y Nicole consiguen trabajo como mucamas en un resort nudista, lo que lleva a situaciones muy incómodas y divertidas.",
            videoUrl: "https://drive.google.com/file/d/1d7COXtULZefzeBPypw5p1ufqNPIXJmgh/view?usp=sharing"
          },
          {
            id: "s2e4",
            title: "Capítulo 4: Haciendo salchichas",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbwykz.jpg",
            description: "Las chicas trabajan en una fábrica de salchichas, donde tienen problemas para mantener el ritmo de la línea de producción.",
            videoUrl: "https://drive.google.com/file/d/1b3FFM8FA1-d7ddjDJI4XB9CiuaQgkziP/view?usp=drive_link"
          },
          {
            id: "s2e5",
            title: "Capítulo 5: La primera cita de Jenny",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbwz3t.jpg",
            description: "Paris y Nicole trabajan en un Burger King, donde causan caos en el autoservicio y cambian el menú a su gusto.",
            videoUrl: "https://drive.google.com/file/d/16pErw8cwLMvx0j1wJMbTyhxZ6LMw1BLo/view?usp=drive_link"
          },
          {
            id: "s2e6",
            title: "Capítulo 6: Oveja Bailarina",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbwz57.jpg",
            description: "En Texas, París y Nicole conocen a una oveja bailarina y les enseñan bronceado en spray a los hijos de unos granjeros.",
            videoUrl: "https://drive.google.com/file/d/17kG4OpEfDwklFCQ7uhn-bDxGpP_ZI0mi/view?usp=drive_link"
          },
          {
            id: "s2e7",
            title: "Capítulo 7: Béisbol",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbwz95.jpg",
            description: "Paris y Nicole trabajan para un equipo de ligas menores de béisbol, ayudando en el campo y animando a los jugadores.",
            videoUrl: "https://drive.google.com/file/d/1vOqbAFo7D_SMjNx7xp5_5iieAUq9Rd2X/view?usp=drive_link"
          },
          {
            id: "s2e8",
            title: "Capítulo 8: Nuevo Look",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbwzf3.jpg",
            description: "En Texas, se quedan con motociclistas y trabajan en un salón de belleza haciendo de las suyas con los clientes.",
            videoUrl: "https://drive.google.com/file/d/1yJ6ODabsKrtLO4BPv2eInJcEHmpbrl7R/view?usp=drive_link"
          },
          {
            id: "s2e9",
            title: "Capítulo 9: Depositado",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbwzkf.jpg",
            description: "En Texas, dan tips románticos en un rancho y causan caos trabajando en la comisaría local.",
            videoUrl: "https://drive.google.com/file/d/1HPiAH7_57GB0-WGmIMQffpbJ0IGZfcQp/view?usp=drive_link"
          },
          {
            id: "s2e10",
            title: "Capítulo 10: De vuelta al ruedo",
            duration: "22 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kbwzpr.jpg",
            description: "En su última parada en Texas, las chicas arrean ganado e intentan salvar a los animales del matadero.",
            videoUrl: "https://drive.google.com/file/d/1Jj-YyHRdCkMv4mRFX9BbZ9M3y4A8MSP_/view?usp=drive_link"
          },
          {
            id: "s2e11",
            title: "Capítulo 11: Lo que no nos permitieron mostrarte",
            duration: "42 min",
            thumbnail: "https://ichef.bbci.co.uk/images/ic/304x171/p0kcb5sk.jpg",
            description: "Recopilación de escenas eliminadas, bloopers y entrevistas con familias y jefes de la segunda temporada.",
            videoUrl: "https://drive.google.com/file/d/12IO85DYYp9Ykem7nzyj1TzQlFNaG2gSO/view?usp=drive_link"
          }
        ]
      },
      {
        id: "s3",
        title: "Temporada 3: Internas",
        episodes: [
          {
            id: "s3e1",
            title: "Capítulo 1: Mecánicas",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/KkhOh9__i5q92KaboawjHwku6G4=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p7896419_i_h10_aa.jpg",
            description: "Paris y Nicole dejan la vida de la ciudad para hacer una pasantía en un taller de carrocería en Manhattan. Rápidamente descubren que trabajar con grasa y situaciones de alta presión es mucho más difícil de lo que esperaban.",
            videoUrl: ""
          },
          {
            id: "s3e2",
            title: "Capítulo 2: Secretarias",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/5JHH5zLCyRMCSgbeuY5Ng8gnQEk=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102098_e_h10_aa.jpg",
            description: "Las chicas se enfrentan al mundo corporativo mientras hacen una pasantía en una firma de reclutamiento de primer nivel. En lugar de archivar papeles, pasan el tiempo buscando el amor y causando el caos en la oficina.",
            videoUrl: ""
          },
          {
            id: "s3e3",
            title: "Capítulo 3: Azafatas",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/1Txw9HVgoKrtMkMMUH6boclQK-M=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102097_e_h10_aa.jpg",
            description: "Paris y Nicole se convierten en asistentes de vuelo por un día. Su enfoque único del servicio al cliente deja a los pasajeros desconcertados mientras navegan por los cielos.",
            videoUrl: ""
          },
          {
            id: "s3e4",
            title: "Capítulo 4: Mortuorio",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/LTn9E1qM-H3FgvTxPXB8LqynUM8=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102099_e_h10_aa.jpg",
            description: "En uno de sus papeles más desafiantes, las chicas hacen una pasantía en una funeraria. Su miedo a la muerte dificulta el trabajo mientras intentan mantener la compostura.",
            videoUrl: ""
          },
          {
            id: "s3e5",
            title: "Capítulo 5: Cirugía Plástica",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/_LJJSQK1q5FyHrqD-KgqaNqdqSo=/fit-in/705x460/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p7896419_i_h10_aa.jpg",
            description: "Paris y Nicole tienen un asiento en primera fila en el mundo de la cirugía plástica. Asisten a un cirujano famoso, pero su falta de conocimientos médicos conduce a algunos momentos incómodos.",
            videoUrl: ""
          },
          {
            id: "s3e6",
            title: "Capítulo 6: Locutoras",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/rozCjO4Qn7wgdXhdXmQd_lx6YBU=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102100_e_h10_aa.jpg",
            description: "Las chicas salen al aire en una estación de radio local. Se supone que deben informar las noticias, pero terminan compartiendo sus opiniones sin filtro sobre los chismes de las celebridades.",
            videoUrl: ""
          },
          {
            id: "s3e7",
            title: "Capítulo 7: Guardería",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/RKaSL7d4lVJ2yi8Y7MR9uJwANZE=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102101_e_h10_aa.jpg",
            description: "Paris y Nicole se encargan de un grupo de niños en una guardería. Descubren que arrear niños pequeños es tan agotador como cualquier trabajo manual.",
            videoUrl: ""
          },
          {
            id: "s3e8",
            title: "Capítulo 8: Zoológico",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/cu10X0H5FnaXrTVLOIrcE0oG4pE=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102102_e_h10_aa.jpg",
            description: "Al trabajar en el zoológico, las chicas tienen la tarea de limpiar los recintos y alimentar a los animales. Sus elecciones de moda no son precisamente prácticas para el entorno salvaje.",
            videoUrl: ""
          },
          {
            id: "s3e9",
            title: "Capítulo 9: Pasteleras",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/qSBN8CAZ6_guMshx5kB9E9q0Gpw=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102103_e_h10_aa.jpg",
            description: "Paris y Nicole hacen una pasantía en una panadería, donde se supone que deben decorar pasteles y atender a los clientes. En cambio, se encuentran en una situación pegajosa.",
            videoUrl: ""
          },
          {
            id: "s3e10",
            title: "Capítulo 10: Psíquicas",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/88sLAMit0K_weqZISGXKE-uamSM=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102104_e_h10_aa.jpg",
            description: "Las chicas trabajan para un psíquico de renombre. Intentan ayudar con las lecturas, pero su propia \"intuición\" conduce a algunas predicciones confusas para los clientes.",
            videoUrl: ""
          },
          {
            id: "s3e11",
            title: "Capítulo 11: Asilo de Ancianos",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/Ynwy15OwA7luw-uucrlSabIVCEc=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102105_e_h10_aa.jpg",
            description: "Paris y Nicole aportan algo de brillo a una casa de retiro. Pasan tiempo con los residentes ancianos, brindando entretenimiento y muchas risas.",
            videoUrl: ""
          },
          {
            id: "s3e12",
            title: "Capítulo 12: Agencia de Publicidad",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/aVYFRXP4uzeSi6FU59fuWqUNDEQ=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102107_e_h10_aa.jpg",
            description: "Las chicas prueban suerte en el marketing en una agencia de publicidad. Sus ideas \"creativas\" para una nueva campaña son un poco demasiado originales para los profesionales.",
            videoUrl: ""
          },
          {
            id: "s3e13",
            title: "Capítulo 13: Bomberos",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/ys3CpIkDf31mNekoMSCj3bWAUkE=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102106_e_h10_aa.jpg",
            description: "Paris y Nicole se unen al departamento de bomberos. Pasan por un entrenamiento e incluso llegan a participar en una llamada, demostrando que tal vez no estén hechas para el calor.",
            videoUrl: ""
          },
          {
            id: "s3e14",
            title: "Capítulo 14: Fabricantes",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/VaIzUn-cDsybbKkTRzj08mL-itU=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102108_e_h10_aa.jpg",
            description: "Al trabajar en una planta de fabricación, las chicas tienen la tarea de operar maquinaria pesada y empacar productos. Su falta de enfoque conduce a un desastre en la línea de producción.",
            videoUrl: ""
          },
          {
            id: "s3e15",
            title: "Capítulo 15: Planeadoras de Bodas",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/dmWSlG25eFUQB_nZpEBAmReGYnc=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102110_e_h10_aa.jpg",
            description: "Paris y Nicole ayudan a una planeadora de bodas en un gran día. Se supone que deben mantener las cosas funcionando sin problemas, pero sus payasadas amenazan con arruinar el momento de la feliz pareja.",
            videoUrl: ""
          },
          {
            id: "s3e16",
            title: "Capítulo 16: Dentistas",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/jv7ft684KIBk4mCCl7CwyvTznpc=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3102112_e_h10_aa.jpg",
            description: "Paris y Nicole prueban suerte como asistentes dentales. Rápidamente descubren que trabajar con bocas de extraños y herramientas afiladas es más de lo que pueden manejar, lo que lleva a resultados hilarantes.",
            videoUrl: ""
          }
        ]
      },
      {
        id: "s4",
        title: "Temporada 4: Hasta que la muerte nos separe",
        episodes: [
          {
            id: "s4e1",
            title: "Capítulo 1: La familia Nolan",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/S4ZcPZc2ekoQ7WNnAP5jHrx24IY=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262010_e_h10_aa.jpg",
            description: "Paris y Nicole se convierten en esposas y madres sustitutas para la familia Nolan. Descubren que equilibrar las tareas del hogar y los niños es más difícil que el glamour.",
            videoUrl: ""
          },
          {
            id: "s4e2",
            title: "Capítulo 2: La familia Ghauri",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/-wC08vv32WQyCL57KhkQHu-Qv-I=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262011_e_h10_aa.jpg",
            description: "Las chicas ayudan a la familia Ghauri. Paris intenta cocinar mientras Nicole lidia con las estrictas reglas de la casa y el choque cultural.",
            videoUrl: ""
          },
          {
            id: "s4e3",
            title: "Capítulo 3: La familia Weekes",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/xOWb9hWvFdBbFTAzQn_BUXDn730=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262012_e_h10_aa.jpg",
            description: "Paris y Nicole ayudan a la familia Weekes con un campamento de verano, pero su estilo de 'ayuda' es todo menos tradicional y causa estragos.",
            videoUrl: ""
          },
          {
            id: "s4e4",
            title: "Capítulo 4: La familia Padilla",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/P62d4Lf9qsE17VePNVt0OpTeihg=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262013_e_h10_aa.jpg",
            description: "Las chicas se mudan con la familia Parris. Deben enfrentar un estilo de vida austero y aprender el valor del trabajo duro en un entorno rural.",
            videoUrl: ""
          },
          {
            id: "s4e5",
            title: "Capítulo 5: La familia Bowden",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/puxp7AIaKkWpx-kNdke97CkSwIM=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262014_e_h10_aa.jpg",
            description: "Paris y Nicole se unen a la familia Burton y se ven envueltas en dramas familiares mientras intentan mantener su propio glamour y competitividad.",
            videoUrl: ""
          },
          {
            id: "s4e6",
            title: "Capítulo 6: La Familia Murrie",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/lGG9NGoRiMsSvhuzfrvrFmxVT50=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262015_e_h10_aa.jpg",
            description: "Un episodio especial donde se repasan los momentos más tensos de la temporada y la famosa pelea mediática entre Paris y Nicole.",
            videoUrl: ""
          },
          {
            id: "s4e7",
            title: "Capítulo 7: La familia Contreras",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/pVNH01M1aOuYdYrUgsF6tqhrLCs=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262016_e_h10_aa.jpg",
            description: "Paris y Nicole ayudan a la familia Beggs en su granja, recordando sus raíces de la primera temporada pero con una rivalidad más marcada.",
            videoUrl: ""
          },
          {
            id: "s4e8",
            title: "Capítulo 8: La familia Beggs",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/7852uyZH49zkcJFqZjIbQ_gLwHs=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262017_e_h10_aa.jpg",
            description: "Continúan las aventuras con los Burton. Las chicas enfrentan desafíos mayores en la crianza de los hijos y en la convivencia doméstica.",
            videoUrl: ""
          },
          {
            id: "s4e9",
            title: "Capítulo 9: La familia Burton",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/ewCOTyss3XnLUS80dOiKorIwn2U=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262018_e_h10_aa.jpg",
            description: "Paris y Nicole se enfrentan a la familia Murrie, donde los choques culturales y las risas por sus ocurrencias están asegurados.",
            videoUrl: ""
          },
          {
            id: "s4e10",
            title: "Capítulo 10: La Confrontación",
            duration: "22 min",
            isComingSoon: true,
            thumbnail: "https://resizing.flixster.com/BLdfuhwdhp3DJI91U5WdP8BEyJU=/370x208/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/p3262019_e_h10_aa.jpg",
            description: "En el final de temporada, las chicas intentan dejar una buena impresión en la familia Noonan antes de regresar finalmente a sus vidas de lujo.",
            videoUrl: ""
          }
        ]
      }
    ],
    studio: "20th Century Fox Television",
    contentRating: "TV-14",
    regionOfOrigin: "United States",
    originalAudio: "Inglés",
    subtitleLanguages: ["Español"],
    copyright: "© 2003 Fox Broadcasting Company",
  },
  {
    id: "serie-2",
    title: "Flavor Of Love",
    logoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhAJ2vN_7ZMWofgDa8NZ0psi2-Sk9i8dLWQyYkeDtCEJYafH8BcmxZLfEs3bAAJ4JOWw3kNZlCJNCX18EYQSY_tnASKR8Jg48gyFJ0IOixQvL8-0N5GDgWTsrH6voBGP04Im-6xlvJUXvEUCAJWgbqz2yqprfm8cpKvQyWu2zbGt8vDj0M7lcrmGa6YO8Q/s2223/On_a_black_2k_202602200240.png",
    detailLogoUrl: "https://disney.images.edge.bamgrid.com/ripcut-delivery/v2/variant/disney/c17f1215-9145-4203-95ae-d3b949898c5d/compose?format=webp&width=2560",
    year: "2006",
    coverImage: "https://is1-ssl.mzstatic.com/image/thumb/BwHBwi7hcc5XvHozBI4QnA/2000x3000CA.TVA23C01.jpg",
    // IMAGEN DE BANNER DESKTOP (Usada en el carrusel principal de inicio en PC)
    bannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh5lXP2ahLiTW5YXWBcqBPyAnJ_PFQmuDxY1CaX6LZsOyjnppH6hnZZf5c-i6AjZCxmnZy3VaVxcl8jGrGhdjNfO8vaq3CZLSd3sldTlXipQ_Se7Luk7k6M20QuGsllfqNhFSH14Uo4nLv9_mdo7oewp3eWuydSxpq66c20DPbeK4Pbh6NW5OSK0mMCAMU/s4506/2880.jpg",
    // IMAGEN DE BANNER MÓVIL (Usada en el carrusel principal de inicio en Móvil, 1000x750)
    mobileBannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiJAur08pZwMFb-gc6L6Nrh9X7MYVOK2luH5y3y_Kpbv2ZZQt65WRUzPU3CmtI4C-c3cSu-W4t_MJqmGVGJSfdjFMg2y6RF_MmF-ZhafLuL46DdTH-GV2SfkpymKOIxq4cO_ju15k7VtaCc7EYBiVUQt8k-KnWqDefjRk54bUexLhCTPUu9LIiy8I1DY5A/s2160/4320x2160sr.png",
    wideImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjrX_4FgqLU7CLtjM_etYqMBJwT5D0_ot8X9xAG7Dzjc5gYyFCcsnj-TcpatyOBrzU9Smgc6qjJICCw9q9Eni6J2KJsnCNkMUeoCrE2XR9Ku6O3MZohSEzA3a34pMI75BWuOYLPB4AgxjnPBDrP32IR8t_HaQF0PFc2KDn3nCPzCUU447ViKyZo806aS8s/s800/hover%204.jpg",
    detailBannerDesktop: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8v9WKefcFNq48KHPSRJqGtkZzzabuSIK1nYudZkYiExiW5gueWF6eYaXmgCTE58GlIPCwnuTy1-GHdLEueNN7Rmxd6LKXeF-xIL7nK0-0EWrAyeRwOa0lBsbWxyQnAuO5TCQvCDauSV2ZH6xm1oBa4HARIBaF32d87WhxGZhfTgxrpCOltpcykewMxbw/s1920/flavor%20of%20love.jpg",
    detailBannerMobile: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjjS7Q7WY2wrYHmyYiSKfYVmNKCLr7x8O6Do1MtN6DtDxL6AXzIAVNZOv0HtaI8CpZ_hpGavlyv3GHG74r5MRkD9n12aTVNGV-w1CMsgx38XJYoTZfRCABTswgPNzk7wRNVBzi0Xpzu1UCnNuYO9DCWoSW77X0CPxsEfC3_LF33NhLPGxO2_yCpd-L8grM/s1920/2.jpg",
    description: "Veinte mujeres compiten por el amor de Flavor Flav. Un reloj gigante, apodos locos y el drama más explosivo de la década.",
    aboutDescription: "Flavor of Love es un programa de telerrealidad estadounidense protagonizado por Flavor Flav del grupo de rap Public Enemy. Mientras VH1 buscaba crear un programa similar a The Bachelor, la serie se convirtió en un éxito masivo debido a su elenco excéntrico y momentos inolvidables. Veinte mujeres viven juntas en una mansión en Encino, California, compitiendo por el afecto de Flav. El programa es conocido por popularizar a Tiffany 'New York' Pollard y por sus ceremonias de eliminación donde Flav entrega relojes gigantes en lugar de rosas.",
    bannerText: "Episodios Disponibles",
    tags: ["Reality", "Citas", "Caos"],
    cast: ["Flavor Flav", "Tiffany Pollard (New York)", "Hoopz", "Pumkin"],
    seasons: [
      {
        id: "s1",
        title: "Temporada 1",
        episodes: [
          {
            id: "s1e1",
            title: "Capítulo 1: 15 camas y un balde de vómito",
            duration: "38 min",
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/4666ee8f-e278-3c2a-b1c9-2d11eccfeb16/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=732f644f-b9f9-3ff2-a35e-2385b71c07ad",
            description: "Flavor Flav recibe a 20 mujeres en su mansión. Tras la primera fiesta en la piscina, la ceremonia de eliminación se interrumpe porque encuentran a una chica vomitando. Cinco se irán a casa.",
            videoUrl: "https://drive.google.com/file/d/1864PdciRPG7jdRafSLdrC7pxQ7c9GZ8U/view?usp=drive_link"
          },
          {
            id: "s1e2",
            title: "Capítulo 2: Un chapuzón con Flav",
            duration: "40 min",
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/517c51a3-bf0a-3a8b-8f1d-1ec1ec331f17/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=ce731957-0f46-30d3-9c40-909e2ff38015",
            description: "Las quince chicas restantes participan en citas rápidas en jacuzzis. Las ganadoras van a patinar con Flav, donde él las interroga sobre sus relaciones pasadas antes de eliminar a cinco más.",
            videoUrl: "https://drive.google.com/file/d/1NN3vjadFekGwUVqfti4bBkX5Rygit3R9/view?usp=drive_link"
          },
          {
            id: "s1e3",
            title: "Capítulo 3: Un amigo de Flav es un amigo mío",
            duration: "40 min",
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/7313421c-ef72-3429-930b-6664d8eb2216/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=b5895390-d5d7-346c-a328-6c75f48855ea",
            description: "Flav divide a las diez chicas para ponerlas a prueba: unas ayudan en un asilo de ancianos y otras organizan una caótica fiesta infantil. Las ganadoras tendrán citas privadas antes de la doble eliminación.",
            videoUrl: "https://drive.google.com/file/d/1UYYrXRtpW5-B_w6SKLHiGTOdJoBoU0Kv/view?usp=drive_link"
          },
          {
            id: "s1e4",
            title: "Capítulo 4: El sabor del pollo",
            duration: "40 min",
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/fce2c133-f58b-359b-a9d4-d57639d4de3a/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=bf1b57c1-a832-3a4c-8a02-9d53c6dfa4df",
            description: "La madre de Flav visita la casa y lleva a las chicas a la iglesia. Luego, ellas compiten preparando pollo frito con la receta secreta de la mamá, quien ayudará a decidir quién será eliminada.",
            videoUrl: "https://drive.google.com/file/d/11ZN7XzwwMB6Sg2wFsMU5YKI2Nn_aHKiC/view?usp=drive_link"
          },
          {
            id: "s1e5",
            title: "Capítulo 5: Lo que pasa con Flav, se queda con Flav",
            duration: "40 min",
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/43419f68-ae69-30bb-a9b5-dc9fb975940d/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=7230a9ad-bad3-3825-9eb5-8b2355c4f0c5",
            description: "Flav lleva a las siete chicas a Las Vegas en su jet privado y las evalúa con una prueba de los cinco sentidos. Sin embargo, una noticia trágica cambia los planes de eliminación inesperadamente.",
            videoUrl: "https://drive.google.com/file/d/1U9rZybHJfzngSCkhTXXUudTDJEuRL2ZL/view?usp=drive_link"
          },
          {
            id: "s1e6",
            title: "Capítulo 6: Interrogadas por Brigitte",
            duration: "41 min",
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/b4769560-8bb0-3077-bbd1-2fc555fae37c/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=1887ecc6-366a-3ba6-a0ad-ac6ded957f54",
            description: "Brigitte Nielsen visita la mansión para someter a las chicas a un detector de mentiras. Tras una salida tensa, Brigitte asesora a Flav sobre a quién eliminar, culminando en un final sorpresivo.",
            videoUrl: "https://drive.google.com/file/d/1ulTWBl7_DyP9qP16WOubyblRsETXEO1R/view?usp=drive_link"
          },
          {
            id: "s1e7",
            title: "Capítulo 7: Los viajes de Flav",
            duration: "40 min",
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/04eba6c6-78d3-328b-aad8-a73e75588769/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=08052399-b8d8-3023-a8c6-445d8bd3e61b",
            description: "Quedan cuatro chicas. Flav lleva a dos a un spa y a las otras dos a un safari. El problema: en cada viaje hay una sola suite para tres personas. ¿Quién se irá a casa?",
            videoUrl: "https://drive.google.com/file/d/1vAnXMSc75sbBR_IfZPSk3m_itRTYnbV_/view?usp=drive_link"
          },
          {
            id: "s1e8",
            title: "Capítulo 8: Sabores familiares",
            duration: "42 min",
            isComingSoon: true,
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/6f3e0352-9453-3614-8ff9-ea9f10f1fcfb/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=e7aef297-e781-3562-83ec-b6e18c22962c",
            description: "Con solo tres chicas en la competencia, Flav invita a sus respectivos padres para conocerlos y tratar de impresionarlos. El episodio termina con una de las eliminaciones más brutales del programa.",
            videoUrl: "https://drive.google.com/file/d/1864PdciRPG7jdRafSLdrC7pxQ7c9GZ8U/preview?usp=drive_link"
          },
          {
            id: "s1e9",
            title: "Capítulo 9: Las bofetadas, gritos y escupitajos que nunca viste",
            duration: "42 min",
            isComingSoon: true,
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/a409459d-b6e5-3f26-a2a2-763751f09f69/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=43ccc19e-2b13-3b89-ba60-3f6e338d9a3c",
            description: "Un episodio especial de recapitulación que muestra imágenes inéditas, detrás de escena, peleas y momentos nunca antes vistos de las chicas conviviendo en la mansión.",
            videoUrl: "https://drive.google.com/file/d/1864PdciRPG7jdRafSLdrC7pxQ7c9GZ8U/preview?usp=drive_link"
          },
          {
            id: "s1e10",
            title: "Capítulo 10: Viva la Flav",
            duration: "42 min",
            isComingSoon: true,
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/0792a680-c6ef-3f5d-9c07-8e43580851d1/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=2072264b-1363-3826-b595-1af7700b6000",
            description: "Para la gran final, Flav lleva a las dos últimas chicas a Puerto Vallarta. Pasa 24 horas a solas con cada una, sabiendo que se odian, para decidir quién será la ganadora absoluta.",
            videoUrl: "https://drive.google.com/file/d/1864PdciRPG7jdRafSLdrC7pxQ7c9GZ8U/preview?usp=drive_link"
          },
          {
            id: "s1e11",
            title: "Capítulo 11: Después del amor",
            duration: "42 min",
            isComingSoon: true,
            thumbnail: "https://imageservice.disco.peacocktv.com/uuid/9e9d3260-db2e-3fcf-b197-050fb67cf629/LAND_16_9/432/236?language=eng&proposition=NBCUOTT&version=03d5e5e0-430a-3e63-bad1-3618f7d1b888",
            description: "Un reencuentro con las 20 concursantes originales para hablar de sus vidas y ventilar los trapos sucios. Además, New York y Pumkin se enfrentan cara a cara por el infame incidente del escupitajo.",
            videoUrl: "https://drive.google.com/file/d/1864PdciRPG7jdRafSLdrC7pxQ7c9GZ8U/preview?usp=drive_link"
          }
        ]
      }
    ],
    studio: "VH1",
    themeColor: "#701a75", // Fuchsia
    contentRating: "TV-14",
    regionOfOrigin: "Estados Unidos",
    originalAudio: "Inglés",
    copyright: "© 2006 VH1"
  },

  // --- NUEVAS SERIES "COMING SOON" EN CATALOGO RETRO ---
  {
    id: "serie-3",
    title: "Yo amo a New York",
    logoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhucVsz8pGbn_3W00_5jWJvr1VAZAxpkP4MwhI0lWOrW2y2EcsgUDHpprR2DvwqlV5m1ER1lUcQqhTeAkbfz7S-MtryBtwmXOdVnDg5173OVQtelBJqgw1btIvdpZgVFj2Pa5QNE343zYKDHrJQRDsMQveMMwAhBu8kL4vnokC_iZZGB1jVFzBNNTsHQnE/s1700/Keeping_the_same_2k_202602200251.png",
    detailLogoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi9OhMGq425-lh_3QLrbjwobkrMFVUWSkva43mZonbvUuY71OGvsx_6_hhNuOLAcK2pTO8gZSLi68tDileAFR2NTdBVxPrBmUtDXub3Oezy7bI4yaYmX8VvO65I-aJm75DKP6rG3veVwNydB9YKizvd8pFfbAwqbDQd03cIBA4Hb12iyVc6i1Fp-FnD1hE/s2560/Sin%20t%C3%ADtulo-3xxxx.png",
    year: "2005",
    coverImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhGwPEJznPT3nonKitrlOEKcpSoquYoMejF9O3d81mHbDSrdbyk2kB9i2lkr7wsiAoc1usJ-A5jREatN71YEhlztW62ixRPi6KHBOUk-1QaE7fxrggs8eQQMCaBHNmOzdm6od4hoDiFMG7BUcNlQHnmwfVmuMDkMQKHtOmW9MkIOIEn3twud12ATyfehsM/s2304/ny.jpg",
    // IMAGEN DE BANNER DESKTOP (Usada en el carrusel principal de inicio en PC)
    bannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOfRGPQcbDHpas4dCPnmeWsj1m2nj_KneSkxhZPlnF-ZQKlWkZeps1ZPGcYTv3-0Ko9XOiVm-Mh1nswaCw10Ix0Alz0VPefoh-5i_Npx7uIVAiIsgUNOGV5RY__PD1fw97wqXn0JZf4NVt4gYpe2fHyRDZLwjEeB3pZfZqO538EbSDn3XvQVWn8FEO-xk/s4053/333.png",
    // IMAGEN DE BANNER MÓVIL (Usada en el carrusel principal de inicio en Móvil, 1000x750)
    mobileBannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjSSalQlEkt8Y5UQkxVG-DzG536XNY8Izr_dy7iYuVRdIIGx3Ltv6orR3qndOgvg47xKLwT83Np_cOXCNkqqVmfnVTxPH70YA3vBmZ3tIBgiJ_WmM3yDk523S81g4_0LJGZ2osBJQ08qkbEQV9oTG9flZslPw_rlXdXMq0sats93AV4qUIj8Yc6uJb2R5I/s2160/e.png",
    wideImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgsXcbevUEdkblmvpCMLn70TwWkB_C4TzxLHvo5FeurL4wHdxxOsteCsW6NsypafHSzlHxwbzpELze4CMtwR8NjEm30IyNbegguQr4x6SxfH9AyYbnqqQtYwL_Ez3FFU14u0TZFPqq5k3H50bfqMyh9mWW07GuUVQ_qhg2zJyDEb2t7Y7z2PHYTQXDRu8Y/s800/hover%202.jpg",
    detailBannerDesktop: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgkW3QEnJNndmtSRt6aCgvZz4ifraNZyrE5fc5A8xDeAd8YOB3P7n11X17i2CxLjVtOwG45h6FLwsjgctmv7uNgV06w5w1nn0IMTJhb9IAFFw06WyEsQ3joyqN_YYARVyLxRnZDTDDupjJbxeU0tuzJ04BujXMJr9TQxTU8hXkh44EciRG7TTRwsg8yydI/s1920/flavor%20of%20love%204.jpg",
    detailBannerMobile: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEirZOGrhX1ojMoRCxyBby4_IxKmtoO3iwPmmoD_05nKZd4F4iYFc0SfUbrVu6sDhhCO3LVqV92yzDxyYCriY3Ja60k262c9OCcKe5QXYFjG-U9IPUE1aaHpd_W7mcc9wXU6lMw46LVM1CCV9std5qkbUw9yIln08O-xPkSocqOAufKAfToAH3_CgBDv7oo/s1920/4.jpg",
    description: "New York, la favorita de los fans de Flavor of Love, está de regreso, soltera y lista para conocer a un nuevo grupo de atractivos solteros.",
    aboutDescription: "I Love New York es un spin-off de Flavor of Love protagonizado por Tiffany 'New York' Pollard. Después de que Flavor Flav le rompiera el corazón dos veces, VH1 le dio su propio programa para encontrar el amor. Veinte hombres compiten por su atención, enfrentándose a desafíos y a la desaprobación de su madre, Sister Patterson. La serie consolidó a New York como la 'Reina de los Reality Shows' y generó múltiples spin-offs propios.",
    bannerText: "Muy Pronto",
    tags: ["Reality", "Competición", "Iconic"],
    cast: ["Tiffany Pollard (New York)", "Sister Patterson", "Chance", "Real"],
    themeColor: "#4c1d95", // Violet
    seasons: [
      {
        id: "s1-ny",
        title: "Temporada 1",
        episodes: [
          {
            id: "s1e1-ny",
            title: "Capítulo 1: ¿Tienes amor por New York?",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:a6401715-2877-4927-a44a-64aa57062464?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E", 
            duration: "42 min",
            description: "New York conoce a los 20 solteros que competirán por su amor. Después de una fiesta salvaje, elimina a cinco hombres en la primera ceremonia."
          },
          {
            id: "s1e2-ny",
            title: "Capítulo 2: El certamen masculino",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:c6401715-2877-4927-a44a-64aa57062464?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Los chicos deben demostrar su fuerza física para proteger a New York. Sister Patterson hace su primera aparición y aterroriza a los concursantes."
          },
          {
            id: "s1e3-ny",
            title: "Capítulo 3: Los grandes jugadores",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:2761e760-dc8d-4a50-a234-c2d89c7087e6?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "New York pone a prueba el estilo de los hombres. Deben diseñar el zapato perfecto para ella, pero algunos diseños resultan ser un desastre total."
          },
          {
            id: "s1e4-ny",
            title: "Capítulo 4: ¿Qué onda, perro?",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:d29d7d97-4ec0-4d07-a313-280ccaf20f55?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Es hora del show de talentos. Los chicos intentan impresionar a New York con sus habilidades, desde cantar hasta bailar, con resultados hilarantes."
          },
          {
            id: "s1e5-ny",
            title: "Capítulo 5: ¿Quién sabe jugar?",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:1b4be477-9ee9-44e8-9285-c7f88e9dc811?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Las tensiones en la casa llegan a su punto máximo. Una pelea explosiva amenaza con enviar a casa a uno de los favoritos de New York."
          },
          {
            id: "s1e6-ny",
            title: "Capítulo 6: Mamá dice que te elimine",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:33928bac-bb55-400b-8dce-b72249834b79?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Los finalistas participan en una sesión de fotos sexy para una revista. New York busca química y confianza frente a la cámara."
          },
          {
            id: "s1e7-ny",
            title: "Capítulo 7: ¿Adivina quién viene a cenar?",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:843ba6d5-d529-43a0-a2f7-eb8cf964dac9?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Los últimos hombres en pie conocen a la temida Sister Patterson. ¿Podrán sobrevivir al interrogatorio de la madre de New York?"
          },
          {
            id: "s1e8-ny",
            title: "Capítulo 8: Sube la temperatura en el desierto",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:1e202243-41e0-436e-b655-bb71c74b97e6?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "60 min",
            description: "New York debe tomar la decisión más difícil de su vida. ¿Quién ganará su corazón y se convertirá en el rey de su imperio?"
          },
          {
            id: "s1e9-ny",
            title: "Capítulo 9: Los nenes de mamá",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:dfb264f8-42a5-4f0e-b155-e2beee0883f5?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Todo el elenco se reúne para discutir los momentos más polémicos de la temporada. Secretos revelados y viejas rencillas resurgen."
          },
          {
            id: "s1e10-ny",
            title: "Capítulo 9: Lo mejor de la temporada",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:78729534-53bf-488d-9f4e-64692850183a?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Todo el elenco se reúne para discutir los momentos más polémicos de la temporada. Secretos revelados y viejas rencillas resurgen."
          },
          {
            id: "s1e11-ny",
            title: "Capítulo 11: El último adiós",
            badge: "Final de Temporada",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:28373b44-3111-4665-b043-6c6cc527e30c?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Todo el elenco se reúne para discutir los momentos más polémicos de la temporada. Secretos revelados y viejas rencillas resurgen."
          },
          {
            id: "s1e12-ny",
            title: "Capítulo 12: La reunión",
            badge: "Capitulo Especial",
            thumbnail: "https://images.paramount.tech/uri/mgid:arc:imageassetref:shared.vh1.us:63f81d5d-54d0-4a0d-a505-655f46831c53?quality=0.7&gen=ntrn",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Todo el elenco se reúne para discutir los momentos más polémicos de la temporada. Secretos revelados y viejas rencillas resurgen."
          }
        ]
      }
    ]
  },
  {
    id: "serie-NYGTW",
    title: "New York Va a Trabajar",
    logoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1oiPit_XJINLtKGS7JPxtiV1HM432J446OOYQgWBCyvwg6OTyyMCcfBhksBh4NSHCcOZagvtaVVzf4yrbrqe7IKREDrtCsjaCqHq7qQj65F1Mzt0OzxyneM9YSCrjuMRpTfbeQA4TuBy4EHICP8e0BxeE-oMwMILCdVpyqVpkjeV0_PRwnmegXmyqZ5g/s800/dsdsd.png",
    detailLogoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi1oiPit_XJINLtKGS7JPxtiV1HM432J446OOYQgWBCyvwg6OTyyMCcfBhksBh4NSHCcOZagvtaVVzf4yrbrqe7IKREDrtCsjaCqHq7qQj65F1Mzt0OzxyneM9YSCrjuMRpTfbeQA4TuBy4EHICP8e0BxeE-oMwMILCdVpyqVpkjeV0_PRwnmegXmyqZ5g/s800/dsdsd.png",
    year: "2004",
    coverImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhfCpRVlQ2BACBlTGDcVugrnO52hBSCn3StZXgtMshsBzMpispEwpnx-5iOZqDosFX5rI1cvlMnHUmkbPzNc7Z2m5y7_Lkh24VnNPrBiljqaGZruR6gmcOs8Z6CX_9gOFs1FktRqy_RkwLuOLtbEPSEYK30cbdA_YxLjjXqgrqGycdW1l-fTmm4sQRIJdA/s16000/uhiu.jpg",
    // IMAGEN DE BANNER DESKTOP (Usada en el carrusel principal de inicio en PC)
    bannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg29ZYfID6l9-tVBC_fzT8tLkFDFx3UKyK26XSHnYuwXkM_ZPOvhL0kCI37ZfhcQrEDIgklQZYqw0YmycMsWoFyJseefCOjhZ2PWPvQzi5ncN2OPQ7LYY5yXX2upUIxxRIvcS755QE-lmbLCsjpcih9O3cVK4JgVjSDcO2lXc4FZwx-bfV-L8jai-c7uZ8/s4320/hbj.jpg",
    // IMAGEN DE BANNER MÓVIL (Usada en el carrusel principal de inicio en Móvil, 1000x750)
    mobileBannerImage: "https://placehold.co/1000x750/FF00FF/FFFFFF/png?text=New+York+Va+A+Trabajar+Mobile",
    wideImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgB3RKPZFZ81zGenrYJceCUuXpiB4n9kVDImY5UM_6S8Mta37Wq7f26aK81rVS-8m6TJrvEf-sGIuFnl0x_vREcLU7232uPWbCGXcwrgfd7ojkqw-jQH09vYU2n-TWSaEcfrphkIk_zmyPw94RJjGZp2cNWOm1IZivT3oNGV4WBQKdjNosCgKsg1dHOn2s/s800/hover%203.jpg",
    detailBannerDesktop: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEheJ6IEgr9evw3wfLNWuS_EdIxKI54vVGTdsb_P_8DbfbHHiDAjB9BD1j3SjROi1zrYRpIXjRui_1hbG1RRIqPodpxYg_Ow5WpMC_Q-g1DyH7AikPzCIXueQ6bk1Dfy4Nw5GaCmIYvzXblkxNhA7ZmJILghvOX62AiI61OFfUP3JjlBOsQLPu3TBqznhSo/s1920/flavor%20of%20love%203.jpg",
    detailBannerMobile: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgXPTvPbHDRGHyKOM2OdGylgpXIRcKSLbVilYF7OEIzDq2y__4Bm_aglksaLOxrpLvHmBIiCK2WQPrXUNTiHbBLEqE9X1O5AGpvmeRnp4aibAcPHKQUNhSLIn_Do6Qh5kH9WtX5PUuf9HcglBwgw-IJRbQObwczPV84e5E3Ac1fzreAysMwD8MnmCu1aVk/s1920/5.jpg",
    description: "Xzibit y el equipo de West Coast Customs transforman autos chatarra en obras maestras del tuning.",
    bannerText: "Muy Pronto",
    tags: ["Cars", "MTV", "Tuning"],
    cast: ["Xzibit", "Mad Mike", "Ish"],
    seasons: [
      {
        id: "s1-pimp",
        title: "Temporada 1",
        episodes: [
          {
            id: "e1-pimp",
            title: "Wyatt's Daihatsu Hi-Jet",
            thumbnail: "https://m.media-amazon.com/images/M/MV5BMTczMjI5OTkyOV5BMl5BanBnXkFtZTgwNzYwMzY2MjE@._V1_.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "20 min",
            description: "Xzibit sorprende a Wyatt para arreglar su micro-van de 1988 que está en las últimas."
          }
        ]
      }
    ]
  },
  {
    id: "serie-charm-school",
    title: "Charm School",
    logoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjby6tbgqFKC6pJ-38L8OpklEEmSWwQAMV2u3arDy6Sba37uq3EgPnsEqeO_roWuicEpvLOkdhKs58Ax3RF4mXtpzrg5jOgPF-9v_5Q-yZNfx0WsHD4rdFzVs4sVEp_2l1OwWL9Yv8acwX_lenJaWJtb6qAO7KpV8Sohn6mH7akNm-QPE7KUIqVcV6Q5qw/s1536/Redo_this_logo_2k_202602220658.png",
    detailLogoUrl: "https://placehold.co/432x162/FFFFFF/000000/png?text=Detail+Logo+432x162",
    year: "2007",
    coverImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
    // IMAGEN DE BANNER DESKTOP (Usada en el carrusel principal de inicio en PC)
    bannerImage: "",
    // IMAGEN DE BANNER MÓVIL (Usada en el carrusel principal de inicio en Móvil, 1000x750)
    mobileBannerImage: "",
    wideImage: "https://placehold.co/800x449/0000FF/FFFFFF/png?text=Charm+School",
    detailBannerDesktop: "https://placehold.co/1920x1080/FF00FF/FFFFFF/png?text=Desktop+Banner+1920x1080",
    detailBannerMobile: "https://placehold.co/1080x1920/FF00FF/FFFFFF/png?text=Mobile+Banner+1080x1920",
    description: "Mo'Nique intenta transformar a las chicas más salvajes de Flavor of Love en damas elegantes. ¿Podrán dejar atrás sus malos hábitos?",
    bannerText: "Todos los episodios disponibles",
    tags: ["Reality", "Competition", "Etiquette"],
    cast: ["Mo'Nique", "Saaphyri", "Buckwild", "Goldie"],
    seasons: [
      {
        id: "s1-charm",
        title: "Temporada 1",
        episodes: [
          {
            id: "s1e1-charm",
            title: "Episodio 1: Sin más apodos",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "1h 5m",
            description: "Trece de las Flavorettes más groseras regresan para aprender modales sociales con Mo'Nique. Las chicas son despojadas de sus apodos y enviadas a una caminata."
          },
          {
            id: "s1e2-charm",
            title: "Episodio 2: Ropa sucia a precio barato",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "43 min",
            description: "Las chicas aprenden sobre etiqueta y modales en la mesa. Un vestido desaparece, causando drama y acusaciones entre el grupo."
          },
          {
            id: "s1e3-charm",
            title: "Episodio 3: La chica de pechos grandes, no-no",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "44 min",
            description: "Las chicas se dividen en equipos para un desafío de desfile de moda. Un equipo sobresale mientras que el otro fracasa miserablemente."
          },
          {
            id: "s1e4-charm",
            title: "Episodio 4: Maestras del debate",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "43 min",
            description: "Las chicas aprenden comunicación efectiva en un desafío de debate. La tensión aumenta cuando los equipos deben dejar en la banca a una integrante."
          },
          {
            id: "s1e5-charm",
            title: "Episodio 5: Gran hedor en Charm School",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "43 min",
            description: "Las chicas compiten para vender perfumes hechos a medida en las calles de Hollywood en un desafío al estilo El Aprendiz."
          },
          {
            id: "s1e6-charm",
            title: "Episodio 6: Dar y recibir",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "44 min",
            description: "Mo desafía a las chicas a donar su propia ropa a una tienda de segunda mano. El robo de una foto causa caos."
          },
          {
            id: "s1e7-charm",
            title: "Episodio 7: Es el cumpleaños de Mo y lloro si quiero",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Las chicas aprenden cómo manejar una entrevista con celebridades con la invitada especial New York. Se revelan secretos sobre el robo de la foto."
          },
          {
            id: "s1e8-charm",
            title: "Episodio 8: Destrozadas desde el suelo",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Las chicas aprenden sobre los cuatro tipos de hombres a evitar en las relaciones y asisten al baile de graduación de Charm School."
          },
          {
            id: "s1e9-charm",
            title: "Episodio 9: Resumen del semestre",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Un vistazo a los momentos más memorables de la temporada, más clips nunca antes vistos."
          },
          {
            id: "s1e10-charm",
            title: "Episodio 10: Poniéndose fabulosas",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "Las cuatro finalistas compiten en un juego de trivia y dan discursos explicando lo que aprendieron. Se corona a la ganadora."
          },
          {
            id: "s1e11-charm",
            title: "Episodio 11: El reencuentro",
            thumbnail: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8RcZA9eSMDp8AR4jN_BGnrufttv5Ex9c5qtDMGqFFvCqZEkkVG0Zh65pCZHoQFY4c2YSy5H4F2OVM-8XOnh4MuAMqqcu2l2ujxhqDbsEzdmZriHUN8Rf2yP9eoAqovmJkZjGT44q8iyiYaOj8Vm-GrV-9nXujcRHEccfpWywr7odRJdpSEk8B5L7TJlU/s2328/jjjj.jpg",
            videoUrl: "https://www.youtube.com/embed/L_jWHffIx5E",
            duration: "42 min",
            description: "El elenco se reúne para discutir el drama, las discusiones y las resoluciones de la temporada."
          }
        ]
      }
    ]
  },
  {
    id: "serie-paris-nicole-uvm",
    title: "Paris & Nicole: Una Vez Más",
    logoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiErnliS1t_OoYmFfB80o4w1KwT26PdvKC3Nv4wc43gJs3gqgddT7Q88VOt_6gCKmH90TMGkIe41P_yT0atEVxUP_Wx1TLt-VRIXBLdvI6lfpTlcyU619Sb9HmnMFn9g3KmkUjrVnzDBSox4UJmAdpzDcV-pguVtZ7udDgDwEirurCzg0mGPjiexCyFoYI/s2560/loca.png",
    detailLogoUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhW7i_CUW6WIf2jMHS4N95RU3xleH_-jPwymLHGlpAWEiymy68epgwfR9n2PzMWkrc-7z4qFwq9xkOBZGDnNyGVSQGAB3fMiSrPdKt2nuy30BZWvbkSyb5senXtBVTgJal9kXgq_YRu0vm_3HFqc9PiQlDoEn_S-6ykhy81xKzksewBZ2BmgHlBvp8ufyI/s2560/Sin%20t%C3%ADtulo-4.png",
    year: "2024",
    coverImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOtUU1IJs8DSXSXRizhzcQYWByuVyWvbSHBTqUI7Zn6dl9s_EChSxbSAWHzEUpNsnmhlFxo-SQ3-pQ0zDfKQq8ZJUwHOAMV1_qOLnfnAL8yDHIdYNgmyPX-g-yyGcQfaCLyE__xNXeaRKSyC6UyQjg26NzXMUdO1hJdIUYGstUNA-Df4_RA89wmsPUS7c/s2048/PAN%20UVM.jpg",
    // IMAGEN DE BANNER DESKTOP (Usada en el carrusel principal de inicio en PC)
    bannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjgMEw39oJ8oZ_HvkG-Ab3V9-cRaWIU8gGZvXzvVku5jE_4Kx0Qww-jVySbQjrvqdKbObuEiFJ7wz4dqQTkavy0lhptefuJPXX2AX7NC7T0MbWohfJF68jLVTM2Qtv1RkjH3X2iIr8bP0G9X477toMBxmymUYlDAfMDq3HBJBy9PMyc_DIijx9MOD37Q80/s4320/vxcvcccccc.jpg",
    // IMAGEN DE BANNER MÓVIL (Usada en el carrusel principal de inicio en Móvil, 1000x750)
    mobileBannerImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhofICaQJnMH5DM9KnkWQ9gNbKDPjjF2v6XdeyZxzI6nQFrSuLKCSwcghvESKG2ZvidV8RSwU742ZbRx_XATnG7n7apP6r-TB9O3fSOucd8LlpPSvOkTCJ6ymsF2cuq7FZ_7_wrWefLa6SO-LMMYrslRIhRwDDqKLLzYbup8_E3Gs_RaHt7X-WetIfsAOc/s2880/cxcddddddddddd.jpg",
    wideImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh9SAVAkZidi7w-S_l6JU_mYejqDnfWgRlDmuxRNQcYMe01aYS_0ViHyBbmFGmO84xGoeHTduRiFULiB_K9K8P8FVI6mj10lqdcwMbTzWtbSQZPCr7nmds11U43j3n48qpDHQyNPfid3y43qNpLpzkDjXn5fgMEZVdesaHfJ0auXXAxQhgjYief45xvMHg/s800/hover%205.jpg",
    detailBannerDesktop: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZK6KPPucAVo44GJc6kEmq05w04Tbq0LbdYbfMPsLxPwsihOQbx5vZvpm3OYyOoJxxb9sLNWkCMkQP-ERgmfx7F08P5BF8lF2-4Kb6oMGCxAmyD5VoAVABd_UViTnStaOU2hK-DdLMZZXNW6UBW8I7zX0I4LRvZLarnI_pKp46fWytEKRujcXyo2rOnf8/s1920/flavor%20of%20love%202.jpg",
    detailBannerMobile: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgzXOUasXYDgO4ZYvG29AAEynxYBQJr_ukfxgfvQ_-txvjAWg7BEUpJPFDylzCkbld3sBd_YR3AQYo0zSMG9OtzWpMKdBpBjInj0DUWpn8gU54uNupYheMGeild7KqE4bT9N9IyWWRt2pU5d2G44wO8qBefkljeaGW2bo5IvzBARUDzD-RMDq6b6eBS0DE/s1920/3.jpg",
    description: "Más de 20 años después de que los íconos originales de los realities, Paris Hilton y Nicole Richie, conquistaran el mundo por primera vez, las amigas de toda la vida se reencuentran en una nueva serie.",
    bannerText: "Muy Pronto",
    tags: ["Reality", "Reunion", "Iconic"],
    cast: ["Paris Hilton", "Nicole Richie"],
    seasons: [
      {
        id: "s1-pnum",
        title: "Temporada 1",
        episodes: [
          {
            id: "s1e1-pnum",
            title: "Capítulo 1: ¿Hacemos una ópera?",
            thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/tY4lggxW-pX64W1n7ipIDg/1200x675.webp",
            videoUrl: "https://www.youtube.com/embed/8Y7Wqerf78",
            duration: "35 min",
            description: "Paris Hilton y Nicole Richie se reencuentran por el 20 aniversario de The Simple Life, visitando al elenco y al equipo de la primera temporada en Arkansas, y contando con la inspiración de Kathy Hilton para relatar la historia de su amistad en una ópera.",
            isComingSoon: true
          },
          {
            id: "s1e2-pnum",
            title: "Capítulo 2: Omg ¡Estamos haciendo una ópera!",
            thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/edxDmpZ7TMMZbPP30UfESA/1200x675.webp",
            videoUrl: "https://www.youtube.com/embed/8Y7Wqerf78",
            duration: "45 min",
            description: "Paris y Nicole descubren exactamente cuánto trabajo tienen que hacer para poder producir una ópera.",
            isComingSoon: true
          },
          {
            id: "s1e3-pnum",
            title: "Capítulo 3: La Sanasapera",
            thumbnail: "https://is1-ssl.mzstatic.com/image/thumb/PAgbYt1eEp8NBg783BQc8g/1200x675.webp",
            videoUrl: "https://www.youtube.com/embed/8Y7Wqerf78",
            duration: "45 min",
            description: "Paris y Nicole secuestran un tour por Hollywood para reclutar una audiencia antes de presentar su ópera.",
            isComingSoon: true
          }
        ]
      }
    ]
  }
];