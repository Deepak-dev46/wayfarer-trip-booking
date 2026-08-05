package com.serviceeverz.wayfarer.service;

import com.serviceeverz.wayfarer.dto.common.BulkMailRequest;
import com.serviceeverz.wayfarer.dto.common.MailRequest;

public interface MailService {
	String sendEmail(MailRequest request);

	String sendBulkEmail(BulkMailRequest request); // ← NEW
}
