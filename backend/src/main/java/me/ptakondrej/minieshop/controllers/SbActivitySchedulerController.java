package me.ptakondrej.minieshop.controllers;

import me.ptakondrej.minieshop.services.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/supabase-activity-scheduler")
public class SbActivitySchedulerController {

	@Value("${scheduler.token}")
	private String schedulerToken;

	private final UserService userService;

	public SbActivitySchedulerController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public String pingDatabase(@RequestHeader("X-SCHEDULER-TOKEN") String signature) {
		if (signature == null || !signature.equals(schedulerToken)) {
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid scheduler token");
		}

		userService.pingDatabase();
		return "OK";
	}
}