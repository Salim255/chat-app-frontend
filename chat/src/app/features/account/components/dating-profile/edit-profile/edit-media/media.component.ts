import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { StringUtils } from "src/app/shared/utils/string-utils";
import { PhotoService } from "src/app/core/services/media/photo.service";
import { ToastService } from "src/app/shared/services/toast/toast.service";

@Component({
  selector: 'app-edit-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss'],
  standalone: false,
})
export class MediaComponent implements OnChanges {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;
  @Input() photos: string [] = [];
  private photoUploads: (FormData | null)[] = [null, null, null, null];
  private currentPhotoIndex: number | null = null;

  constructor(private toastService: ToastService ,private photoService: PhotoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['photos'] && changes['photos'].currentValue) {
      this.photos = this.setUserImages();
    }
  }
  onBack(): void {
    //this.location.back()
  }
   trackByIndex(index: number): number {
    return index;
  }

  setUserImages(): string[] {
    const imagesList = [
      StringUtils.getAvatarUrl(this.photos[0]),
      StringUtils.getAvatarUrl(this.photos[1]),
      StringUtils.getAvatarUrl(this.photos[2]),
      StringUtils.getAvatarUrl(this.photos[3])
    ];
    return imagesList;
  }

  async onTakePhoto(slotIndex: number): Promise<void>{

    try {
      const { preview, formData }= await this.photoService.takePicture();
    if (!preview || !formData) return;

    // 1) Set preview for UI
    this.photos[slotIndex] = preview ;

    // 2) Store the FormData for submission later
    this.photoUploads[slotIndex] = formData;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error instanceof Error &&  error.message === 'web-platform') {
        this.onIconClick(slotIndex)
      }
    }
  }


  onFileSelected(event: Event, slotIndex: number):void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || this.currentPhotoIndex === null) return;

    const file = input.files[0];
    if (!file.type.startsWith('image/')) {
      this.toastService.showError('Only image files are allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.photos[this.currentPhotoIndex!] = reader.result as string;
      this.currentPhotoIndex = null;
    };
    reader.readAsDataURL(file);

    // Build FormData from the File object
    const formData = new FormData();
     const fileName = `${Date.now()}-image.jpg`;
    formData.append('photo',file, fileName);
    // Pass formData to upload logic
    this.photoUploads[slotIndex] = formData;
  }


  onIconClick(idx: number): void {
    // Store the index and trigger the global file input
    this.currentPhotoIndex = idx;
    const input = this.fileInputRef.nativeElement;
    input.value = ''; // reset input so it always triggers change
    input.click();
  }
}
