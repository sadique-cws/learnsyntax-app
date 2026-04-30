<?php

namespace App\Notifications;

use App\Mail\GenericMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Notifications\Messages\BroadcastMessage;

class GenericNotification extends Notification implements ShouldBroadcastNow
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
        
        // Auto-add broadcast if database is present and not already there
        if (in_array('database', $this->channels) && !in_array('broadcast', $this->channels)) {
            $this->channels[] = 'broadcast';
        }

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
     * Get the broadcast representation of the notification.
     */
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'subject' => $this->subject,
            'body' => $this->data['body'] ?? ($this->data['message'] ?? ''),
            'link' => $this->data['link'] ?? null,
            'data' => $this->data,
            'created_at' => now(),
        ]);
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
