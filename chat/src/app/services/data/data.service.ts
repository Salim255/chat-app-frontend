import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class DataService {
    constructor(){}


    profileSImages = [
      ['https://images.unsplash.com/photo-1530785602389-07594beb8b73?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlJTIwYmxhY2t8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1568782517100-09bf22d88c2d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8cGVvcGxlJTIwYmxhY2t8ZW58MHx8MHx8fDA%3D',
      'https://images.unsplash.com/photo-1531300185372-b7cbe2eddf0b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjJ8fHBlb3BsZSUyMGJsYWNrfGVufDB8fDB8fHww'
      ],
      [
        'https://images.unsplash.com/photo-1488371934083-edb7857977df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBlb3BsZSUyMGJveXxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1462926703708-44ab9e271d97?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBlb3BsZSUyMGJveXxlbnwwfHwwfHx8MA%3D%3D'
        ,
        'https://images.unsplash.com/photo-1463674349210-38e4fa154dda?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlJTIwYm95fGVufDB8fDB8fHww'
      ],
      [
        'https://images.unsplash.com/photo-1440589473619-3cde28941638?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVvcGxlJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVvcGxlJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D',
        'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D'
      ],
      [
        'https://images.unsplash.com/photo-1482555670981-4de159d8553b?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1485811661309-ab85183a729c?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D'
      ],
      ['https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjR8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1495216875107-c6c043eb703f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
      ],
      [
        'https://images.unsplash.com/photo-1441123694162-e54a981ceba5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDZ8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1496595351388-d74ec2c9c9cc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTB8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1465145498025-928c7a71cab9?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTF8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D'
      ],
      [
        'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTl8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1484399172022-72a90b12e3c1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTR8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTZ8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',

      ],
      [
        'https://images.unsplash.com/photo-1456885284447-7dd4bb8720bf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjB8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1514626585111-9aa86183ac98?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjZ8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzF8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D'
      ],
      [
        'https://images.unsplash.com/photo-1516908205727-40afad9449a8?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njd8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1519419691348-3b3433c4c20e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NzB8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D',
        'https://images.unsplash.com/photo-1439402702863-6434b61e6392?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODJ8fHBlb3BsZSUyMGdpcmx8ZW58MHx8MHx8fDA%3D'
      ]
    ]

    get getImages(){
      return this.profileSImages;
    }
}
