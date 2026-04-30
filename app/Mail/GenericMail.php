<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GenericMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subject;
    public $template;
    public $mailData;

    /**
     * Create a new message instance.
     */
    public function __construct($subject, $template, $mailData)
    {
        $this->subject = $subject;
        $this->template = $template;
        $this->mailData = $mailData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $data = is_array($this->mailData) ? $this->mailData : [];
        $data['subject'] = $this->subject;
        $data['body'] = $data['body'] ?? ($data['message'] ?? '');

        return new Content(
            view: $this->template,
            with: $data,
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
