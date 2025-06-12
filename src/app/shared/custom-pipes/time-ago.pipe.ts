import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: false,
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number | null): string {
    if (!value) return '';

    const now = new Date();
    const date = new Date(value);
    const seconds = Math.floor((+now - +date) / 1000);

    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
    if (hours < 24) return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
    if (days < 2) return 'yesterday';
    if (days < 30) return `${days} days ago`;
    if (months < 12) return months === 1 ? 'a month ago' : `${months} months ago`;
    return years === 1 ? 'a year ago' : `${years} years ago`;
  }
}
