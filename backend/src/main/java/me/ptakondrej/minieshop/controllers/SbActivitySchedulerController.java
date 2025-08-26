package me.ptakondrej.minieshop.controllers;

import me.ptakondrej.minieshop.services.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/supabase-activity-scheduler")
public class SbActivitySchedulerController {

	private final UserService userService;

	public SbActivitySchedulerController(UserService userService) {
		this.userService = userService;
	}

	@GetMapping
	public String pingDatabase() {
		userService.pingDatabase();
		return "OK";
	}
}
