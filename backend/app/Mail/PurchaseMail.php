<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PurchaseMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public array $data
    ) {}

    public function build()
    {
        return $this->subject('Confirmación de compra - BellaPro')
                    ->view('emails.purchase')
                    ->with(['data' => $this->data]);
    }
}
