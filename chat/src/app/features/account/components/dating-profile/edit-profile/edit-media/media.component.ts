import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { StringUtils } from "src/app/shared/utils/string-utils";
import { PhotoCaptureResult, PhotoService } from "src/app/core/services/media/photo.service";
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
      const { preview, formData }: PhotoCaptureResult = await this.photoService.takePicture( );
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


  onFileSelected(event: Event):void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length || this.currentPhotoIndex === null) return;

    const file = input.files[0];
     const result =  this.photoService.webPlatformFileUpload(file);
     if (result && result as PhotoCaptureResult) {
      this.photoUploads[this.currentPhotoIndex] = result.formData;
      this.photos[this.currentPhotoIndex] = result.preview ;
     }
  }


  onIconClick(idx: number): void {
    // Store the index and trigger the global file input
    this.currentPhotoIndex = idx;
    const input = this.fileInputRef.nativeElement;
    input.value = ''; // reset input so it always triggers change
    input.click();
  }
}
