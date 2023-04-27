import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

import { PaymentIntent } from '@stripe/stripe-js';
import Stripe from 'stripe';

export const PLUTO_ID = new InjectionToken<string>('[PLUTO] ClientID');

@Injectable({ providedIn: 'root' })
export class StripePaymentService {
  public BASE_URL = 'https://api.pluto.ricardosanchez.dev/api';

  constructor(
    @Inject(PLUTO_ID) private readonly clientId: string,
    private readonly http: HttpClient
  ) {}

  createPaymentIntent(
    params: Stripe.PaymentIntentCreateParams
  ): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      `${this.BASE_URL}/payments/create-payment-intent`,
      params,
      { headers: { merchant: this.clientId } }
    );
  }

  createVerificationSession(userId: string): Observable<any> {
    return this.http.post<PaymentIntent>(
      `${this.BASE_URL}/identity/create-verification-session`,
      { userId },
      { headers: { merchant: this.clientId } }
    );
  }
}
