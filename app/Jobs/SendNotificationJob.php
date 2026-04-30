<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendNotificationJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $user;
    public $channels;
    public $subject;
    public $template;
    public $data;

    /**
     * Create a new job instance.
     */
    public function __construct($user, $channels, $subject, $template, $data)
    {
        $this->user = $user;
        $this->channels = $channels;
        $this->subject = $subject;
        $this->template = $template;
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        \Illuminate\Support\Facades\Log::info('Processing SendNotificationJob for: ' . $this->user->email, [
            'subject' => $this->subject,
            'channels' => $this->channels
        ]);

        try {
            $this->user->notify(new \App\Notifications\GenericNotification(
                $this->channels,
                $this->subject,
                $this->template,
                $this->data
            ));
            \Illuminate\Support\Facades\Log::info('Notification sent successfully for: ' . $this->user->email);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Notification failed for: ' . $this->user->email . ' Error: ' . $e->getMessage());
            throw $e;
        }
    }
}
