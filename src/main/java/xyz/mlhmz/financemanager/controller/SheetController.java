package xyz.mlhmz.financemanager.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import xyz.mlhmz.financemanager.dtos.MutateSheetDto;
import xyz.mlhmz.financemanager.dtos.QuerySheetDto;
import xyz.mlhmz.financemanager.dtos.SheetStatsDto;
import xyz.mlhmz.financemanager.entities.Sheet;
import xyz.mlhmz.financemanager.mappers.SheetMapper;
import xyz.mlhmz.financemanager.services.SheetService;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sheets")
@AllArgsConstructor
public class SheetController {
    private final SheetService sheetService;
    private final SheetMapper sheetMapper;

    @PostMapping
    public QuerySheetDto createSheet(@RequestBody MutateSheetDto mutateSheetDto, @AuthenticationPrincipal Jwt jwt) {
        Sheet sheet = this.sheetMapper.mapMutateSheetDtoToSheet(mutateSheetDto);
        return this.sheetMapper.mapSheetToQuerySheetDto(
                this.sheetService.createSheet(sheet, jwt)
        );
    }

    @GetMapping
    public List<QuerySheetDto> getAllSheets(@AuthenticationPrincipal Jwt jwt) {
        return this.sheetMapper.mapSheetListToQuerySheetDtoList(
                this.sheetService.findAllSheets(jwt)
        );
    }

    @GetMapping("/{uuid}/stats")
    public SheetStatsDto calculateSheetStats(@PathVariable UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        return new SheetStatsDto(this.sheetService.sumSheetTransactionsByUuidAndUser(uuid, jwt));
    }

    @GetMapping("/{uuid}")
    public QuerySheetDto getSheetByUuid(@PathVariable UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        Sheet sheet = this.sheetService.findSheetByUUID(uuid, jwt);
        return this.sheetMapper.mapSheetToQuerySheetDto(sheet);
    }

    @PutMapping("/{uuid}")
    public QuerySheetDto updateSheetByUuid(@PathVariable UUID uuid,
                                           @RequestBody MutateSheetDto mutateSheetDto,
                                           @AuthenticationPrincipal Jwt jwt) {
        Sheet sheet = this.sheetMapper.mapMutateSheetDtoToSheet(mutateSheetDto);
        return this.sheetMapper.mapSheetToQuerySheetDto(
                this.sheetService.updateSheet(uuid, sheet, jwt)
        );
    }

    @DeleteMapping("/{uuid}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSheetByUuid(@PathVariable UUID uuid, @AuthenticationPrincipal Jwt jwt) {
        this.sheetService.deleteSheetByUUID(uuid, jwt);
    }
}
