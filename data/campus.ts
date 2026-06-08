// data/campus.ts

export interface Campus {
  id: string;
  name: string;
}

export interface University {
  id: string;
  name: string;
  type: 'university' | 'private-college';
  campuses?: Campus[]; // Only universities have campuses
  subRegion?: string; // For private colleges in Addis Ababa
}

// Generate unique IDs
const generateId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// All Universities (A-Z)
export const universities: University[] = [
  // A
  {
    id: generateId("Adama Science and Technology University"),
    name: "Adama Science and Technology University (ASTU)",
    type: 'university',
    campuses: [{ id: generateId("Main Campus ASTU"), name: "Main Campus" }]
  },
  {
    id: generateId("Addis Ababa Science and Technology University"),
    name: "Addis Ababa Science and Technology University (AASTU)",
    type: 'university',
    campuses: [{ id: generateId("Main Campus AASTU"), name: "Main Campus" }]
  },
  {
    id: generateId("Addis Ababa University"),
    name: "Addis Ababa University",
    type: 'university',
    campuses: [
      { id: generateId("4 Kilo Campus"), name: "4 Kilo Campus" },
      { id: generateId("5 Kilo Campus"), name: "5 Kilo Campus" },
      { id: generateId("6 Kilo Campus"), name: "6 Kilo Campus" },
      { id: generateId("Black Lion School of Health College"), name: "Black Lion School of Health College" },
      { id: generateId("College of Veterinary Medicine"), name: "College of Veterinary Medicine" },
      { id: generateId("EiABC"), name: "EiABC" },
      { id: generateId("Post Graduate and Extension"), name: "Post Graduate and Extension" },
      { id: generateId("School of Commerce"), name: "School of Commerce" },
      { id: generateId("School of Music Yared"), name: "School of Music Yared" },
      { id: generateId("Sefere Selam School of Health"), name: "Sefere Selam School of Health" },
      { id: generateId("St Pauls Hospital Millennium Medical College"), name: "St. Paul's Hospital Millennium Medical College" }
    ]
  },
  {
    id: generateId("Adigrat University"),
    name: "Adigrat University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Adigrat"), name: "Main Campus" }]
  },
  {
    id: generateId("Ambo University"),
    name: "Ambo University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Ambo"), name: "Main Campus" },
      { id: generateId("Wolisso Campus"), name: "Wolisso Campus" },
      { id: generateId("Achalu Hundessa Campus"), name: "Achalu Hundessa Campus" },
      { id: generateId("Guder Campus"), name: "Guder Campus" }
    ]
  },
  {
    id: generateId("Arba Minch University"),
    name: "Arba Minch University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Arba Minch"), name: "Main Campus" },
      { id: generateId("Chamo Campus"), name: "Chamo Campus" },
      { id: generateId("Abaya Campus"), name: "Abaya Campus" },
      { id: generateId("Kulfo Campus"), name: "Kulfo Campus" },
      { id: generateId("Nechsar Campus"), name: "Nechsar Campus" },
      { id: generateId("Sawla Campus"), name: "Sawla Campus" }
    ]
  },
  {
    id: generateId("Arsi University"),
    name: "Arsi University",
    type: 'university',
    campuses: [
      { id: generateId("Ardu Campus"), name: "Ardu Campus" },
      { id: generateId("Dinsho Campus"), name: "Dinsho Campus" },
      { id: generateId("Health Campus Arsi"), name: "Health Campus" },
      { id: generateId("Bekoji Campus"), name: "Bekoji Campus" }
    ]
  },
  {
    id: generateId("Assosa University"),
    name: "Assosa University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Assosa"), name: "Main Campus" }]
  },
  {
    id: generateId("Axum University"),
    name: "Axum University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Axum"), name: "Main Campus" },
      { id: generateId("Health Campus Axum"), name: "Health Campus" },
      { id: generateId("Shire Campus"), name: "Shire Campus" },
      { id: generateId("Adwa Campus"), name: "Adwa Campus" }
    ]
  },
  {
    id: generateId("Aysaita Teachers Education College"),
    name: "Aysaita Teachers Education College",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Aysaita"), name: "Main Campus" }]
  },

  // B
  {
    id: generateId("Bahir Dar University"),
    name: "Bahir Dar University",
    type: 'university',
    campuses: [
      { id: generateId("Polly Campus"), name: "Polly Campus" },
      { id: generateId("Peda Campus"), name: "Peda Campus" },
      { id: generateId("Selam Campus"), name: "Selam Campus" },
      { id: generateId("Sebat Amit Campus"), name: "Sebat Amit Campus" },
      { id: generateId("Yibab Campus"), name: "Yibab Campus" },
      { id: generateId("Zenzelima Campus"), name: "Zenzelima Campus" }
    ]
  },
  {
    id: generateId("Bonga University"),
    name: "Bonga University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Bonga"), name: "Main Campus" }]
  },
  {
    id: generateId("Bonga TTC"),
    name: "Bonga TTC",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Bonga TTC"), name: "Main Campus" }]
  },
  {
    id: generateId("Borena University"),
    name: "Borena University",
    type: 'university',
    campuses: [{ id: generateId("Yabelo Campus"), name: "Yabelo Campus" }]
  },
  {
    id: generateId("Bulhora University"),
    name: "Bulhora University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Bulhora"), name: "Main Campus" },
      { id: generateId("Adola Campus"), name: "Adola Campus" }
    ]
  },

  // D
  {
    id: generateId("Dambidollo University"),
    name: "Dambidollo University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Dambidollo"), name: "Main Campus" }]
  },
  {
    id: generateId("Debark University"),
    name: "Debark University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Debark"), name: "Main Campus" }]
  },
  {
    id: generateId("Debre Birhan University"),
    name: "Debre Birhan University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Debre Birhan"), name: "Main Campus" }]
  },
  {
    id: generateId("Debre Markos University"),
    name: "Debre Markos University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Debre Markos"), name: "Main Campus" },
      { id: generateId("Burea Campus"), name: "Burea Campus" }
    ]
  },
  {
    id: generateId("Debre Tabor University"),
    name: "Debre Tabor University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Debre Tabor"), name: "Main Campus" }]
  },
  {
    id: generateId("Dilla University"),
    name: "Dilla University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Dilla"), name: "Main Campus" },
      { id: generateId("Referral Campus Dilla"), name: "Referral Campus" }
    ]
  },
  {
    id: generateId("Diredawa University"),
    name: "Diredawa University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Diredawa"), name: "Main Campus" }]
  },

  // E
  {
    id: generateId("Ethiopian Defense University"),
    name: "Ethiopian Defense University",
    type: 'university',
    campuses: [
      { id: generateId("Engineering College Defense"), name: "Engineering College" },
      { id: generateId("Health Science College Defense"), name: "Health Science College" }
    ]
  },
  {
    id: generateId("Ethiopian Public Service University"),
    name: "Ethiopian Public Service University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus EPSU"), name: "Main Campus" }]
  },

  // F
  {
    id: generateId("Federal Technical and Vocational Training Institute"),
    name: "Federal Technical and Vocational Training Institute",
    type: 'university',
    campuses: [{ id: generateId("Main Campus FTVTI"), name: "Main Campus" }]
  },

  // G
  {
    id: generateId("Gambela University"),
    name: "Gambela University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Gambela"), name: "Main Campus" }]
  },
  {
    id: generateId("Gondar University"),
    name: "Gondar University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Gondar"), name: "Main Campus" },
      { id: generateId("Medical Campus Gondar"), name: "Medical Campus" }
    ]
  },

  // H
  {
    id: generateId("Haremaya University"),
    name: "Haremaya University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Bate"), name: "Main Campus (Bate)" },
      { id: generateId("Health Campus Harer"), name: "Health Campus (Harer)" }
    ]
  },
  {
    id: generateId("Hawassa University"),
    name: "Hawassa University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Hawassa"), name: "Main Campus" },
      { id: generateId("ACA Campus"), name: "ACA Campus" },
      { id: generateId("Referral Campus Hawassa"), name: "Referral Campus" },
      { id: generateId("Awada Campus"), name: "Awada Campus" },
      { id: generateId("Wondo Campus"), name: "Wondo Campus" },
      { id: generateId("Dayie Campus"), name: "Dayie Campus" }
    ]
  },

  // I
  {
    id: generateId("Injubara University"),
    name: "Injubara University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Injubara"), name: "Main Campus" }]
  },

  // J
  {
    id: generateId("Jijga University"),
    name: "Jijga University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Jijga"), name: "Main Campus" }]
  },
  {
    id: generateId("Jimma University"),
    name: "Jimma University",
    type: 'university',
    campuses: [
      { id: generateId("Main and Beco Campus"), name: "Main and Beco Campus (JUMBCF)" },
      { id: generateId("Institute of Technology Campus"), name: "Institute of Technology Campus (JIT/kito fellowship)" },
      { id: generateId("Agri Campus Jimma"), name: "Agri Campus" },
      { id: generateId("Agaro Campus"), name: "Agaro Campus" }
    ]
  },
  {
    id: generateId("Jimma Rift Valley and Dandiboru"),
    name: "Jimma Rift Valley and Dandiboru",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Jimma RV"), name: "Main Campus" }]
  },
  {
    id: generateId("Jinka University"),
    name: "Jinka University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Jinka"), name: "Main Campus" }]
  },

  // K
  {
    id: generateId("Kebridehar University"),
    name: "Kebridehar University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Kebridehar"), name: "Main Campus" }]
  },
  {
    id: generateId("Kotebe University of Education"),
    name: "Kotebe University of Education",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Kotebe"), name: "Main Campus" }]
  },

  // M
  {
    id: generateId("Medewelabu University"),
    name: "Medewelabu University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Medewelabu"), name: "Main Campus" },
      { id: generateId("Health Campus Medewelabu"), name: "Health Campus" },
      { id: generateId("Kuyera Campus"), name: "Kuyera Campus" }
    ]
  },
  {
    id: generateId("Mekdela Amba University"),
    name: "Mekdela Amba University",
    type: 'university',
    campuses: [
      { id: generateId("Gimba Campus"), name: "Gimba Campus" },
      { id: generateId("Mekane Selam Campus"), name: "Mekane Selam Campus" }
    ]
  },
  {
    id: generateId("Mekelle University"),
    name: "Mekelle University",
    type: 'university',
    campuses: [
      { id: generateId("Adhaqi Campus"), name: "Adhaqi Campus" },
      { id: generateId("Arid Campus"), name: "Arid Campus" },
      { id: generateId("Kelamino Campus"), name: "Kelamino Campus" },
      { id: generateId("Kuya Campus"), name: "Kuya Campus" },
      { id: generateId("Ayder Campus"), name: "Ayder Campus" }
    ]
  },
  {
    id: generateId("Meti Ethio Grand and Duruman"),
    name: "Meti Ethio Grand and Duruman",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Meti"), name: "Main Campus" }]
  },
  {
    id: generateId("Mettu University"),
    name: "Mettu University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Mettu"), name: "Main Campus" },
      { id: generateId("Bedele Campus"), name: "Bedele Campus" }
    ]
  },
  {
    id: generateId("Mizan Agri"),
    name: "Mizan Agri",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Mizan Agri"), name: "Main Campus" }]
  },
  {
    id: generateId("Mizan Aman Health Science College"),
    name: "Mizan Aman Health Science College",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Mizan Health"), name: "Main Campus" }]
  },
  {
    id: generateId("Mizan Tep University"),
    name: "Mizan -Tep University",
    type: 'university',
    campuses: [
      { id: generateId("Tepi Campus"), name: "Tepi Campus" },
      { id: generateId("Main Campus Mizan"), name: "Main Campus" },
      { id: generateId("Aman Campus"), name: "Aman Campus" }
    ]
  },

  // N
  {
    id: generateId("Nekemit University"),
    name: "Nekemit University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Nekemit"), name: "Main Campus" },
      { id: generateId("Shambu Campus"), name: "Shambu Campus" },
      { id: generateId("Gimbi Campus"), name: "Gimbi Campus" }
    ]
  },

  // O
  {
    id: generateId("Odabultu University"),
    name: "Odabultu University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Odabultu"), name: "Main Campus" }]
  },

  // P
  {
    id: generateId("Post Graduate Fellowship"),
    name: "Post Graduate Fellowship",
    type: 'university',
    campuses: [
      { id: generateId("Hawassa Main Campus Fellowship"), name: "Hawassa Main Campus" },
      { id: generateId("Hawassa ACA Campus Fellowship"), name: "Hawassa ACA Campus" },
      { id: generateId("Hawassa Referral Campus Fellowship"), name: "Hawassa Referral Campus" }
    ]
  },

  // R
  {
    id: generateId("Raya University"),
    name: "Raya University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Raya"), name: "Main Campus" }]
  },

  // S
  {
    id: generateId("Selale University"),
    name: "Selale University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Selale"), name: "Main Campus" },
      { id: generateId("Health Campus Selale"), name: "Health Campus" }
    ]
  },
  {
    id: generateId("Semera University"),
    name: "Semera University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Semera"), name: "Main Campus" }]
  },

  // U
  {
    id: generateId("Unity Campus Northeast"),
    name: "Unity Campus",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Unity"), name: "Main Campus" }]
  },

  // W
  {
    id: generateId("Wachemo University"),
    name: "Wachemo University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Wachemo"), name: "Main Campus" },
      { id: generateId("Durame Campus"), name: "Durame Campus" },
      { id: generateId("Referral Campus Wachemo"), name: "Referral Campus" }
    ]
  },
  {
    id: generateId("Welkite University"),
    name: "Welkite University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Welkite"), name: "Main Campus" },
      { id: generateId("Cluster Campus Welkite"), name: "Cluster Campus" }
    ]
  },
  {
    id: generateId("Werabe University"),
    name: "Werabe University",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Werabe"), name: "Main Campus" }]
  },
  {
    id: generateId("Wolayta Sodo University"),
    name: "Wolayta Sodo University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Wolayta"), name: "Main Campus" },
      { id: generateId("Otona Campus"), name: "Otona Campus" },
      { id: generateId("Dawro Tercha Campus"), name: "Dawro Tercha Campus" },
      { id: generateId("Boditi Campus"), name: "Boditi Campus" }
    ]
  },
  {
    id: generateId("Woldia University"),
    name: "Woldia University",
    type: 'university',
    campuses: [
      { id: generateId("Main Campus Woldia"), name: "Main Campus" },
      { id: generateId("Mersa Campus"), name: "Mersa Campus" },
      { id: generateId("Gewane Agri College"), name: "Gewane Agri College" }
    ]
  },
  {
    id: generateId("Wollo University"),
    name: "Wollo University",
    type: 'university',
    campuses: [
      { id: generateId("Dessie Main Campus"), name: "Dessie Main Campus" },
      { id: generateId("Kombolcha Institute of Technology"), name: "Kombolcha Institute of Technology (KIoT)" },
      { id: generateId("College of Medicine and Health Science Wollo"), name: "College of Medicine and Health Science" }
    ]
  },

  // Y
  {
    id: generateId("Yrgalem Hospital Medical College"),
    name: "Yrgalem Hospital Medical College",
    type: 'university',
    campuses: [{ id: generateId("Main Campus Yrgalem"), name: "Main Campus" }]
  }
];

// All Private Colleges (A-Z)
export const privateColleges: University[] = [
  // A
  {
    id: generateId("ACT College"),
    name: "ACT College",
    type: 'private-college',
    subRegion: "Piassa Sub Region"
  },
  {
    id: generateId("Adama General Hospital Medical College"),
    name: "Adama General Hospital Medical College",
    type: 'private-college',
    subRegion: "Adama"
  },
  {
    id: generateId("Admas College"),
    name: "Admas College",
    type: 'private-college',
    subRegion: "22 Sub Region"
  },
  {
    id: generateId("Admas Michael College"),
    name: "Admas Michael College",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },
  {
    id: generateId("Admas University Bishoftu Campus"),
    name: "Admas University Bishoftu Campus",
    type: 'private-college',
    subRegion: "Bishoftu"
  },
  {
    id: generateId("African Medical College"),
    name: "African Medical College",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },
  {
    id: generateId("Agarpha Gbrhna College"),
    name: "Agarpha Gbrhna College",
    type: 'private-college'
  },
  {
    id: generateId("Alkan"),
    name: "Alkan",
    type: 'private-college',
    subRegion: "Pawlos Sub Region"
  },
  {
    id: generateId("Arba Minch Fellowship of Colleges"),
    name: "Arba Minch Fellowship of Colleges",
    type: 'private-college'
  },
  {
    id: generateId("Arba Minch Health College"),
    name: "Arba Minch Health College",
    type: 'private-college'
  },
  {
    id: generateId("Ardayta Gbrhna College"),
    name: "Ardayta Gbrhna College",
    type: 'private-college'
  },
  {
    id: generateId("Arsingelie Medical"),
    name: "Arsingelie Medical",
    type: 'private-college'
  },
  {
    id: generateId("Atlas Mexico"),
    name: "Atlas",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },
  {
    id: generateId("Atlas Medical College"),
    name: "Atlas Medical College",
    type: 'private-college',
    subRegion: "Bole Sub Region"
  },
  {
    id: generateId("Ayer Tena Principal"),
    name: "Ayer Tena Principal",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },

  // B
  {
    id: generateId("BST"),
    name: "BST",
    type: 'private-college',
    subRegion: "Pawlos Sub Region"
  },

  // C
  {
    id: generateId("CPU College"),
    name: "CPU College",
    type: 'private-college',
    subRegion: "Piassa Sub Region"
  },

  // D
  {
    id: generateId("Dilla Education College"),
    name: "Dilla Education College",
    type: 'private-college'
  },
  {
    id: generateId("Dilla Infolink"),
    name: "Dilla Infolink",
    type: 'private-college'
  },
  {
    id: generateId("Diredawa Polytechnic College"),
    name: "Diredawa Polytechnic College",
    type: 'private-college'
  },

  // E
  {
    id: generateId("Ethiopia Aviation Academy"),
    name: "Ethiopia Aviation Academy",
    type: 'private-college',
    subRegion: "Bole Sub Region"
  },

  // G
  {
    id: generateId("General Winget Polytechnic College"),
    name: "General Winget Polytechnic College",
    type: 'private-college',
    subRegion: "Pawlos Sub Region"
  },
  {
    id: generateId("Goba Enate Medical"),
    name: "Goba Enate Medical",
    type: 'private-college'
  },

  // H
  {
    id: generateId("Harambe University Adama"),
    name: "Harambe University Adama",
    type: 'private-college',
    subRegion: "Adama"
  },
  {
    id: generateId("Harer Health Science College"),
    name: "Harer Health Science College",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Afericabeza"),
    name: "Hawassa Afericabeza",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Atelas"),
    name: "Hawassa Atelas",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa CEP"),
    name: "Hawassa CEP",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Fura"),
    name: "Hawassa Fura",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Health College"),
    name: "Hawassa Health",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Infolink"),
    name: "Hawassa Infolink",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Pharma"),
    name: "Hawassa Pharma",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Rift Valley"),
    name: "Hawassa RiftVaile",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa TTC"),
    name: "Hawassa TTC",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Tula TVT"),
    name: "Hawassa Tula TVT",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa TVT 1"),
    name: "Hawassa TVT-1",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa TVT 2"),
    name: "Hawassa TVT-2",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Yanite"),
    name: "Hawassa Yanite",
    type: 'private-college'
  },
  {
    id: generateId("Hawassa Zion"),
    name: "Hawassa Zion",
    type: 'private-college'
  },
  {
    id: generateId("Hayat Medical"),
    name: "Hayat Medical",
    type: 'private-college',
    subRegion: "Bole Sub Region"
  },
  {
    id: generateId("Hilco College"),
    name: "Hilco College",
    type: 'private-college',
    subRegion: "Piassa Sub Region"
  },
  {
    id: generateId("Hope University"),
    name: "Hope University",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },
  {
    id: generateId("Hosana Health College"),
    name: "Hosana Health College",
    type: 'private-college'
  },
  {
    id: generateId("Hosana Polytechnic College"),
    name: "Hosana Polytechnic College",
    type: 'private-college'
  },
  {
    id: generateId("Hosana Rift Valley"),
    name: "Hosana Rift Valley",
    type: 'private-college'
  },
  {
    id: generateId("Hosana Teaching College TTC"),
    name: "Hosana Teaching College (TTC)",
    type: 'private-college'
  },

  // K
  {
    id: generateId("Kibur College"),
    name: "Kibur College",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },

  // L
  {
    id: generateId("Lorkan College"),
    name: "Lorkan College",
    type: 'private-college',
    subRegion: "22 Sub Region"
  },

  // M
  {
    id: generateId("Mehanayim College"),
    name: "Mehanayim College",
    type: 'private-college',
    subRegion: "Asela"
  },
  {
    id: generateId("Mekane Eyesus Seminary"),
    name: "Mekane Eyesus Seminary",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },
  {
    id: generateId("Menchen for Menchen"),
    name: "Menchen for Menchen",
    type: 'private-college'
  },
  {
    id: generateId("Microlink College Piassa"),
    name: "Microlink College",
    type: 'private-college',
    subRegion: "Piassa Sub Region"
  },

  // N
  {
    id: generateId("New Generation College"),
    name: "New Generation College",
    type: 'private-college',
    subRegion: "22 Sub Region"
  },

  // Q
  {
    id: generateId("Queens College"),
    name: "Queens College",
    type: 'private-college',
    subRegion: "Pawlos Sub Region"
  },

  // R
  {
    id: generateId("Rift Valley Mexico"),
    name: "Rift Valley",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },
  {
    id: generateId("Rift Valley University Adama"),
    name: "Rift Valley University Adama",
    type: 'private-college',
    subRegion: "Adama"
  },
  {
    id: generateId("Rift Valley University Bishoftu Campus"),
    name: "Rift Valley University Bishoftu Campus",
    type: 'private-college',
    subRegion: "Bishoftu"
  },
  {
    id: generateId("Rift Valley University Pawlos"),
    name: "Rift Valley University",
    type: 'private-college',
    subRegion: "Pawlos Sub Region"
  },
  {
    id: generateId("Rohoboth 1 Medical College"),
    name: "Rohoboth -1 Medical College",
    type: 'private-college',
    subRegion: "Asela"
  },
  {
    id: generateId("Rohoboth 2 Medical College"),
    name: "Rohoboth -2 Medical College",
    type: 'private-college',
    subRegion: "Asela"
  },

  // S
  {
    id: generateId("Seven Star College"),
    name: "Seven-Star College",
    type: 'private-college',
    subRegion: "Piassa Sub Region"
  },
  {
    id: generateId("Shashemene Pharma"),
    name: "Shashemene Pharma",
    type: 'private-college'
  },
  {
    id: generateId("Shashamene Pardyez"),
    name: "Shashamene Pardyez",
    type: 'private-college'
  },
  {
    id: generateId("St Lideta"),
    name: "St. Lideta",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },
  {
    id: generateId("St Merry University"),
    name: "St. Merry University",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },

  // T
  {
    id: generateId("Tegbared Polytechnic College"),
    name: "Tegbared Polytechnic College",
    type: 'private-college',
    subRegion: "Mexico Sub Region"
  },
  {
    id: generateId("TMS"),
    name: "TMS",
    type: 'private-college',
    subRegion: "Piassa Sub Region"
  },

  // U
  {
    id: generateId("Unity University"),
    name: "Unity University",
    type: 'private-college',
    subRegion: "Bole Sub Region"
  },
  {
    id: generateId("Universal Medical College"),
    name: "Universal Medical College",
    type: 'private-college',
    subRegion: "22 Sub Region"
  },

  // W
  {
    id: generateId("Wolayta Sodo Agri College"),
    name: "Wolayta Sodo Agri College",
    type: 'private-college'
  },
  {
    id: generateId("Wolayta Sodo Infolink College"),
    name: "Wolayta Sodo Infolink College",
    type: 'private-college'
  },
  {
    id: generateId("Wolayta Sodo Pharma College"),
    name: "Wolayta Sodo Pharma College",
    type: 'private-college'
  },
  {
    id: generateId("Wolayta Sodo Selihem Business College"),
    name: "Wolayta Sodo Selihem Business College",
    type: 'private-college'
  },

  // Y
  {
    id: generateId("Yanet"),
    name: "Yanet",
    type: 'private-college',
    subRegion: "Pawlos Sub Region"
  }
];

// Combine all institutions (Universities + Private Colleges) sorted A-Z
export const allInstitutions: University[] = [...universities, ...privateColleges].sort((a, b) => 
  a.name.localeCompare(b.name)
);

// Helper functions
export const getAllUniversities = () => universities;
export const getAllPrivateColleges = () => privateColleges;
export const getAllInstitutions = () => allInstitutions;

export const getInstitutionById = (id: string) => {
  return allInstitutions.find(inst => inst.id === id);
};

export const getCampusesByUniversity = (universityId: string) => {
  const university = universities.find(u => u.id === universityId);
  return university?.campuses || [];
};