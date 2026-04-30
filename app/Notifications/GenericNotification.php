<?php

namespace App\Notifications;

use App\Mail\GenericMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class GenericNotification extends Notification
{
    use Queueable;

    public $channels;
    public $subject;
    public $template;
    public $data;

    /**
     * Create a new notification instance.
     */
    public function __construct($channels, $subject, $template, $data)
    {
        $this->channels = $channels; // array like ['mail', 'database']
        $this->subject = $subject;
        $this->template = $template;
        $this->data = $data;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return $this->channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage|GenericMail
    {
        return (new GenericMail($this->subject, $this->template, $this->data))
            ->to($notifiable->email);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'subject' => $this->subject,
            'body' => $this->data['body'] ?? ($this->data['message'] ?? ''),
            'link' => $this->data['link'] ?? null,
            'data' => $this->data,
        ];
    }
}
